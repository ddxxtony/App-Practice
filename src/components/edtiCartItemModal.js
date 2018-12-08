
import React, { PureComponent } from 'react';
import { Text, View, Modal, StyleSheet, TextInput, Dimensions, TouchableOpacity, Image } from 'react-native';
import NativeTachyons, { sizes } from 'react-native-style-tachyons';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Joi from 'joi-react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Button, Fieldset, utils } from 'avenaChallenge/src/controls';
import { deleteItemFromCart, editItemAmounInCart } from 'avenaChallenge/src/actions/cart';


const mapDispatchToProps = (dispatch) => bindActionCreators({ deleteItemFromCart, editItemAmounInCart }, dispatch);

const schema = {
    amount: Joi.string().trim().required().regex(/^[1-9]\d*$/).options({ language: { string: { regex: { base: 'es inválida' } } } }).label('La cantidad'),
};


class _EdtiCartItemModal extends PureComponent {

    static propTypes = {
        onClose: PropTypes.func.isRequired,
        visible: PropTypes.bool.isRequired,
        cartItem: PropTypes.object,
        editItemAmounInCart: PropTypes.func.isRequired,
        deleteItemFromCart: PropTypes.func.isRequired
    }

    onSubmit = async (cartItem) => {
        const { onClose, editItemAmounInCart} =this.props;
        cartItem.value = Number(cartItem.value);
        await editItemAmounInCart(cartItem);
        onClose();
    }

    onDelete = async () => {
        const {deleteItemFromCart, cartItem, onClose } = this.props;
        await deleteItemFromCart(cartItem);
        onClose();
        
    }

    render() {

        const { onClose, visible, cartItem } = this.props;
        return (
            <Modal
                animationType='slide'
                visible={visible}
                onRequestClose={onClose}
            >
                <View cls='flx-i'>
                    <TouchableOpacity cls='asfe pa3' onPress={onClose} >
                        <Image cls='rm-contain h2 w2' source={require('avenaChallenge/assets/cross.png')} />
                    </TouchableOpacity>
                    <KeyboardAwareScrollView cls='ph3' >
                        <View cls='mh4 jcc' style={styles.container} >
                            <Text cls='black f4 b tc ' >Indica la cantidad de producto que requires</Text>
                            <Fieldset onSubmit={this.onSubmit} schema={schema} source={cartItem} cls='ass' >
                                {({ amount }, { loading, submitForm }) => (
                                    <>
                                        <View>
                                            <TextInput
                                                cls='bb b--lightgray f5 tc black pv3'
                                                value={amount.value ? amount.value + '' : amount.value}
                                                onChangeText={amount.onChange}
                                                placeholder='Cantidad'
                                                placeholderTextColor='gray'
                                            />
                                            {amount.errored && <Text cls='red' >{amount.message}</Text>}
                                        </View>
                                        <Button cls='mh4 mv3 white' color='red' onPress={this.onDelete} loading={loading}>Eliminar</Button>
                                        <Button cls='mh4' onPress={submitForm} loading={loading} >Guardar</Button>
                                    </>
                                )}
                            </ Fieldset>
                        </View>
                    </KeyboardAwareScrollView>
                </View>
            </Modal>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('window').height - utils.getStatusBarHeight() - (sizes.pv3 * 2 + sizes.h2)
    },
});

export const EdtiCartItemModal = connect(undefined, mapDispatchToProps)(NativeTachyons.wrap(_EdtiCartItemModal));
