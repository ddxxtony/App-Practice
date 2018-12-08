
import Joi from 'joi-react-native';
import queryString from 'query-string';
import { createSelector } from 'reselect';
import _ from 'lodash';
import { Alert } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';


const queryHandler = function (source) {
    const { component, key, serializer } = this;
    const { history, location } = component.props;

    let result = {};
    if (_.isUndefined(key))
        result = serializer(source);
    else if (_.has(source, 'target.value'))
        result[key] = serializer(source.target.value);
    else
        result[key] = serializer(source);

    const newParams = _.pickBy({ ...(queryString.parse(location.search, { arrayFormat: 'index' })), ...result }, _.identity);
    history.replace(`${history.location.pathname}?${queryString.stringify(newParams, { arrayFormat: 'index' })}`);
};

export const makeGetUrlParams = (defaultParams = {}, deserializers = {}) => createSelector(
    (state, props) => props.location.search,
    (search) => {
        let params = queryString.parse(search, { arrayFormat: 'index' });
        params = { ...defaultParams, ...params };
        params = _.mapValues(params, (value, key) => deserializers[key] ? deserializers[key](value) : value);
        return params;
    }
);


export const showDialog = (title, message = '', buttons, options) => {
    return setTimeout(() => Alert.alert(
        title,
        message,
        buttons,
        { cancelable: true, ...options }
    ), 200);
};

export const filterObjects = (objects, { filter, columns }) => {
    const normalizeStr = _.flow(_.trim, _.toLower, _.deburr);

    filter = normalizeStr(filter);

    objects = _(objects).toArray();

    if (filter) {
        objects = objects.filter((object) => {
            return _.find(columns, (objectKey) => {
                return _.includes(normalizeStr(_.isString(objectKey) ? object[objectKey] : objectKey(object)), filter);
            });
        });
    }

    return objects.value();
};


export const formatCurrency = (number) => {
    const numberOfDecimals = 2;
    const decimalSeparator = '.';
    const naturalSeparator = ',';
    const prefix = number < 0 ? '-$' : '$';
    const i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(numberOfDecimals)));
    let j;
    j = (j = i.length) > 3 ? j % 3 : 0;
    return prefix + (j ? i.substr(0, j) + naturalSeparator : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + naturalSeparator) + (numberOfDecimals ? decimalSeparator + Math.abs(number - i).toFixed(numberOfDecimals).slice(2) : '');
  };


  export { getStatusBarHeight };
export const delay = (ms) => new Promise((res) => setTimeout(res, ms));
export const createQueryStringHandler = (component, key, serializer = _.identity) => queryHandler.bind({ component, key, serializer });
export const joiEmailValidation = Joi.string().regex(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).max(50).options({ language: { string: { regex: { base: 'no es valido.' } } } });