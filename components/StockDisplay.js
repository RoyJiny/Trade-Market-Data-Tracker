import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class StockDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const data = this.props.data;

    return (
        <View style={styles.wrapper}>
            <View style={{flex: 1,flexDirection:'row', justifyContent: 'space-between' ,alignContent: 'center'}}>
                
                <Text style={styles.shortcut}>{data.symbol}</Text>
                <Text 
                    style={data.changePercent[0]==='-' ?styles.negativeChange :styles.possitiveChange}
                >
                    {data.changePercent.replace('-','')}
                </Text>
                <Text style={styles.price}>
                    ${data.price}
                </Text>
                               
            </View>              
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
        marginBottom: 10
    },
    price: {
        fontSize: 18,
        color: '#9da0a6',
        fontStyle: 'italic',
        flex:1
    },
    shortcut: {
        fontSize: 18,
        fontWeight: '500',
        flex:1
    },
    possitiveChange: {
        fontSize: 18,
        color: '#009900',
        flex:1
    },
    negativeChange: {
        fontSize: 18,
        color: '#D60000',
        flex:1
    }
});