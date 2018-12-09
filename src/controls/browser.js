import React, { PureComponent } from 'react';
import { View, Text, Modal, WebView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';
import NativeTachyons from 'react-native-style-tachyons';
import _ from 'lodash';

class _Browser extends PureComponent {

  static propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    url: PropTypes.string,
    onNavigationChange: PropTypes.func,
  }

  static defaultProps = {
    onNavigationChange: _.noop
  }

  state = {}

  onNavigationChange = (data) => {
    this.setState({ pageTitle: data.title });
    this.props.onNavigationChange(data);
  }
  render() {
    const { visible, onClose, url } = this.props;
    const urlParts = _.split(url, '/');
    const rootUrl = _.join([urlParts[0], urlParts[2]], '//');
    const { pageTitle } = this.state;
    return (
      <Modal
        animationType='slide'
        visible={visible}
        onRequestClose={onClose}
      >
        <View cls='flx-i bg-white'>
          <View cls='pv2 flx-row aic bb b--lightgray' >
            <TouchableOpacity cls='mr2 ml1' activeOpacity={0.5} onPress={onClose}>
              <Image cls='rm-contain' style={styles.crossIcon} source={require('avenaChallenge/assets/cross.png')} />
            </TouchableOpacity>
            <View cls='flx-i pr2'>
              <Text numberOfLines={1} cls='f4'>{pageTitle || 'Cargando contenido...'}</Text>
              <Text numberOfLines={1} cls='f6'>{rootUrl}</Text>
            </View>
          </View>
          {visible && <WebView
            cls='flx-i'
            onNavigationStateChange={this.onNavigationChange}
            style={{ width: '100%', height: '100%' }}
            source={{ uri: url }}
            javaScriptEnabled={true}
          />}
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  crossIcon: {
    height: 22,
    width: 22
  }
}
);
export const Browser = NativeTachyons.wrap(_Browser);
