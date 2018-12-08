import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import NativeTachyons from 'react-native-style-tachyons';

class _Button extends PureComponent {

  static propTypes = {
    onPress: PropTypes.func,
    as: PropTypes.func,
    activeOpacity: PropTypes.number,
    children: PropTypes.string.isRequired,
    color: PropTypes.string
  }

  static defaultProps = {
    onPress: _.noop,
    activeOpacity: 0.4
  }

  state = { awaiting: false }

  componentWillUnmount() {
    this.unmounted = true;
  }

  handleOnPress = async (...params) => {
    try {
      this.setState({ awaiting: true });
      return await this.props.onPress(...params);
    } finally {
      if (!this.unmounted) this.setState({ awaiting: false });
    }
  }

  render() {
    const { as: component,color,  disabled, loading, activeOpacity, style, children, onPress: ignored, cls: ignored2, ...rest } = this.props;
    const { awaiting } = this.state;
    const Component = component || TouchableOpacity;
    const isDisabled = loading || disabled || awaiting;

    return (
      <Component
        onPress={this.handleOnPress}
        cls={`bg-orange pv3 br2 ${color?`bg-${color}`:''} `}
        activeOpacity={0.7}
        disabled={isDisabled}
        style={[{ opacity: isDisabled ? 0.7 : 1 }, ..._.castArray(style)]}
        {...rest}
      >
        { loading || awaiting
          ? <ActivityIndicator size='small' color='black' />
          : <Text cls='black tc'>{children}</Text>
        }
      </Component>
    );
  }
}

export const Button = NativeTachyons.wrap(_Button);
