import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Feather';

export default class CryptoModal extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: true };
  }

  render() {
    return (
        <Modal isVisible={this.props.visible}>
            <View style={styles.wrapper}>
                <Text> CryptoModal </Text>
                <TouchableOpacity onPress={() => {
                    this.props.close();
                    }} 
                >
                    <Icon name='x-square' size={40}/>
                </TouchableOpacity>
            </View>
        </Modal>
    );
  }
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: 'white',
        borderRadius: 10,
        borderColor: 'transparent',
        borderWidth: 1,
        height: 400
    }
})