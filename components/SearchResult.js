import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default class SearchResult extends Component {
    render() {        
        const { data, onClick, type } = this.props;
        
        switch (type){
            case 'crypto':
                return (
                    <View style={styles.wrapper}>
                        <View>
                            <Text style={styles.shortcut}>{data.shortcut}</Text>
                            <Text style={styles.name}>{data.name}</Text>
                        </View>
                        
                        <View style={{flexDirection:'column', justifyContent: 'center'}}>
                            <Image source={{uri:data.icon}} style={{height: 33, width: 33}}/>
                        </View> 
        
                        <View style={{flexDirection:'column', justifyContent: 'center'}}>
                            <TouchableOpacity
                                onPress = {() => onClick( data.shortcut, 'crypto')}
                            >
                                <Icon name='plus' size={32}/>    
                            </TouchableOpacity> 
                        </View>
        
                    </View>
                );
            case 'currency':
                return (
                    <View style={styles.wrapper}>
                        <Text style={styles.shortcut}>{data.symbol}</Text>
        
                        <View style={{flexDirection:'column', justifyContent: 'center'}}>
                            <TouchableOpacity
                                onPress = {() => onClick( data.symbol, 'currency')}
                            >
                                <Icon name='plus' size={32}/>    
                            </TouchableOpacity> 
                        </View>        
                    </View>
                );
            case 'stock':
                    return (
                        <View style={styles.wrapper}>
                            <Text style={styles.shortcut}>{data.symbol}</Text>
            
                            <View style={{flexDirection:'column', justifyContent: 'center'}}>
                                <TouchableOpacity
                                    onPress = {() => onClick( data.symbol, 'stock')}
                                >
                                    <Icon name='plus' size={32}/>    
                                </TouchableOpacity> 
                            </View>        
                        </View>
                    );
        }
    }

        
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingTop: 5,
        marginBottom: 10,
        justifyContent: 'space-between',
    },
    name: {
        fontSize: 18,
        color: '#9da0a6',
        fontStyle: 'italic'
    },
    shortcut: {
        fontSize: 18,
        fontWeight: '500'
    },
    timeStamps: {
        fontSize: 18,
        color: '#9da0a6',
    },
    possitiveChange: {
        fontSize: 18,
        color: '#009900',
    },
    negativeChange: {
        fontSize: 18,
        color: '#D60000',
    }
});