import React, { Component } from 'react';
import { View, Text, TouchableOpacity, AsyncStorage, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default class SettingsScreen extends Component {
  clearCrypto = async () => {
    const {navigation} = this.props;
    await AsyncStorage.setItem('cryptos', '');
    navigation.navigate('Home');
  }

  clearCurrency = async () => {
    const {navigation} = this.props;
    await AsyncStorage.setItem('currencies', '');
    navigation.navigate('Home');
  }

  clearStocks = async () => {
    const {navigation} = this.props;
    await AsyncStorage.setItem('stocks','');
    navigation.navigate('Home');
  }

  deleteButton(title) {
    let callback;
    switch (title){
      case 'Cryptography':
        callback = this.clearCrypto;
        break;
      case 'Stocks':
        callback = this.clearStocks;
        break;
      case 'Currency':
        callback = this.clearCurrency;
        break;
    }   

    return (
      <View key={title}>
        <TouchableOpacity onPress={callback} style={styles.lineWrapper}>
          <Icon name='trash-2' size={28}/>
          <Text style={styles.title}>Clear {title} Data</Text>
        </TouchableOpacity>        
      </View>
    );
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <Text style={{fontSize:32, color: '#9da0a6', marginBottom: 40, marginLeft: 30, fontStyle:'italic', fontWeight:'bold'}}>
          Settings
        </Text>

        {
          ['Cryptography', 'Stocks', 'Currency'].map((item) => {
            return (
              this.deleteButton(item)
            );
          })
        }

        <Text style={{alignSelf: 'center', color: '#9da0a6', marginTop: 60, paddingHorizontal: 5}}>
          Please notice that deleting data will require app-restart for updating
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper:{
    backgroundColor: '#F5F5F5',
    flex: 1,
    paddingTop: 2,
  },
  lineWrapper: {
    flexDirection: 'row',
    paddingVertical: 5,
    backgroundColor: 'white',
    marginBottom: 7
  },  
  button: {
    marginHorizontal: 5
  },
  title: {
    fontSize: 18,
  }
});