import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import NativeTachyons from 'react-native-style-tachyons';



class _EmptyMessage extends PureComponent {

    static propTypes = {
        message: PropTypes.string.isRequired
    }

    render() {
        const { message } = this.props;
        return (
            <View cls='bg-white mt6 ph4' >
                <Text cls='gray f5 tc'>{message}</Text>
            </View>
        );
    }
}

export const EmptyMessage = NativeTachyons.wrap(_EmptyMessage);