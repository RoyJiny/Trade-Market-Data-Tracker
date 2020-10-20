import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class CurrencyDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    const {data} = this.props;

    return (
      <View style={styles.wrapper}>
        <Text style={styles.symbol}>{data.symbol}</Text>
        <Text style={styles.value}>${1/data.value}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingTop: 5,
        marginBottom: 3,
        paddingHorizontal: 40
    },
    symbol: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    value:{
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left'
    }
})