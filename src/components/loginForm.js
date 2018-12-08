import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { View, TextInput, StyleSheet, Dimensions, Image, Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NativeTachyons from 'react-native-style-tachyons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import _ from 'lodash';
import Joi from 'joi-react-native';

import { Button, Fieldset, utils } from 'avenaChallenge/src/controls';
import { logIn } from 'avenaChallenge/src/actions/auth';


const mapDispatchToProps = (dispatch) => bindActionCreators({ logIn }, dispatch);
const loginTemplate = {};
const loginSchema = {
  email: utils.joiEmailValidation.label('El correo').required(),
  psw: Joi.string().required().max(30).label('La contraseña').required()
};

const Input = NativeTachyons.wrap(({ placeholder, value, onChange, errored, message, ...extraProps }) => {

  return (
    <View>
      <TextInput cls='bb b--lightgray f5 tc black pv3' value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor='gray' {...extraProps} />
      {errored && <Text cls='red' >{message}</Text>}
    </View>
  );
})

class _LoginForm extends PureComponent {

  static propTypes = {
    logIn: PropTypes.func.isRequired
  }

  render() {
    const { logIn } = this.props;
    return (
      <View cls='flx-i' >
        <KeyboardAwareScrollView cls='flx-i' bounces={false} enableOnAndroid keyboardShouldPersistTaps='handled'>
          <View cls='mh4 jcc' style={styles.container} >
            <View cls='aic mb2'>
              <Image cls='w5 h4 rm-contain' source={require('avenaChallenge/assets/dig.png')} />
            </View>

            <Fieldset onSubmit={logIn} schema={loginSchema} source={loginTemplate} cls='ass' >
              {({ email, psw }, { loading, submitForm }) => (
                <>
                  <Input placeholder='Correo' {...email} autoCapitalize='none' keyboardType='email-address'/>
                  <Input placeholder='Contraseña'  secureTextEntry={true}  {...psw} autoCapitalize='none' />
                  <Button cls='ma4' onPress={submitForm} loading={loading}   >Iniciar Sesión</Button>
                </>
              )}
            </ Fieldset>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

export const LoginForm = connect(undefined, mapDispatchToProps)(NativeTachyons.wrap(_LoginForm));


const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height
  },
});