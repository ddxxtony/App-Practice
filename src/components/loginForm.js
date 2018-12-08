import React, { PureComponent } from 'react';
import { View, TextInput, StyleSheet, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import NativeTachyons from 'react-native-style-tachyons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';



class _LoginForm extends PureComponent {

  static propTypes = { }

  render() {
    return (
      <View cls='flx-i' >
        <KeyboardAwareScrollView cls='flx-i' bounces={false} enableOnAndroid keyboardShouldPersistTaps='handled'>
          <View cls='mh4 jcc' style={styles.container} >
            <TextInput cls='bb b--lightgray f5 tc black pv3' placeholder='Correo' placeholderTextColor='gray' />
            <TextInput cls='bb b--lightgray f5 tc black pv3' placeholder='Contraseña' placeholderTextColor='gray' secureTextEntry />
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

export const LoginForm = connect(undefined, undefined)(NativeTachyons.wrap(_LoginForm));


const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('window').height
    },
  });