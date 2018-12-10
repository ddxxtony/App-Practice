import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Joi from 'joi-react-native';
import { createSelector } from 'reselect';
import { View } from 'react-native';
import NativeTachyons from 'react-native-style-tachyons';

const language = {
  key: '{{!label}} ',
  any: {
    invalid: 'contiene un valor invalido.',
    empty: 'no puede estar vacío(a).',
    required: 'es requerido(a).',
    allowOnly: 'necesita ser uno de los siguientes valores: {{valids}}.',
  },
  string: {
    base: 'debe de ser una cadena válida',
    min: 'necesita tener una longitud mínima de {{limit}} caracteres.',
    max: 'necesita tener una longitud maxima de {{limit}} caracteres.',
    length: 'necesita tener una longitud de {{limit}} caracteres',
    email: 'no es valido.',
    alphanum: 'debe contener solamente caracteres alfanuméricos',
    trim: 'no debe tener espacios en blanco iniciales o finales.',
    creditCard: 'debe de ser un número válido',
  }
};


export class Fieldset extends PureComponent {

  static propTypes = {
    source: PropTypes.object,
    schema: PropTypes.object.isRequired,
    children: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    cloneSource: PropTypes.func.isRequired,
    parent: PropTypes.object,
    enabled: PropTypes.bool,
  }

  static defaultProps = {
    source: {},
    enabled: true,
    cloneSource: (source) => (source.copy ? source.copy() : _.cloneDeep(source)),
  }


  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.source !== prevState.lastSource || nextProps.enabled !== prevState.lastEnabled)
      return {
        errors: {},
        source: nextProps.cloneSource(nextProps.source),
        lastEnabled: nextProps.enabled,
        lastSource: nextProps.source
      };
    return null;
  }

  constructor(props) {
    super(props);
    this.isUnmounted = false;
    this.state = { loading: false, lastEnabled: null, lastSource: null };
  }
  resetSource = () => {
    this.setState({ source: this.props.cloneSource(this.props.source), errors: {} });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  submitForm = async () => {
    const { source } = this.state;
    const { schema, onSubmit } = this.props;

    this.setState({ loading: true, errors: {} });

    const { error } = Joi.validate(
      source.attributes ? _.pick(source, _.keys(schema)) : source,
      schema,
      { abortEarly: false, allowUnknown: true, convert: false, noDefaults: true, language },
    );

    if (error) {
      const errors = _.transform(error.details, (errors, { path: [key], message }) => errors[key] = message, {});
      this.setState({ errors, loading: false });
      return false;
    }
    const success = await onSubmit(source);

    if (success && !this.isUnmounted)
      this.setState({ source: this.props.cloneSource(this.props.source) });

    if (!this.isUnmounted)
      this.setState({ loading: false });

    return success;
  }

  onChange = (prop, value) => {
    const newVal = _.has(value, 'target.value')
      ? value.target.value
      : _.has(value, 'target.checked')
        ? value.target.checked
        : value;
    this.setState((prevState) => {
      prevState.source[prop] = _.isNil(newVal) || newVal === '' ? undefined : newVal;
      return ({ source: prevState.source, errors: { ...prevState.errors, [prop]: '' } });
    }, !this.props.parent ? undefined : () => this.props.onSubmit(this.state.source));
    return true;
  }


  calculateProps = createSelector(
    createSelector((state, props) => props.schema, (schema) => _.mapValues(schema, (val, key) => _.partial(this.onChange, key))),
    (state) => state.errors,
    (state) => state.source,
    (state, props) => props.enabled,
    (schemaOnChange, errors, source, enabled) => _.mapValues(schemaOnChange, (onChangeProp, key) => ({
      message: errors[key] || '',
      errored: !!errors[key],
      value: source[key],
      onChange: enabled ? onChangeProp : _.noop,
    }))
  );

  render() {
    const { loading } = this.state;
    const { children, enabled } = this.props;
    const extraProps = _.pickBy(_.omit(this.props, _.keys(Fieldset.propTypes)), _.identity);
    const props = this.calculateProps(this.state, this.props);

    return (
      <View {...extraProps} >
        {NativeTachyons.wrap(children)(props, { submitForm: enabled ? this.submitForm : _.noop, resetSource: this.resetSource, loading })}
      </View>
    );
  }

}