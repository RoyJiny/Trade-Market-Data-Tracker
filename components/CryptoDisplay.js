import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Animated, PanResponder, LayoutAnimation, UIManager } from 'react-native';

export default class CryptoDisplay extends Component {
    constructor(props){
        super(props);

        const position = new Animated.ValueXY();
        const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                if (gesture.dx < this.state.x) { 
                    this.setState({backSpring: false});
                } else {
                    this.setState({backSpring: true});
                }

                if(gesture.dx>-80) {
                    position.setValue({x: gesture.dx, y:0});
                    this.setState({x: gesture.dx});
                } else{
                    position.setValue({x: -80, y:0});
                    this.setState({x:80});
                }

            },
            onPanResponderRelease: (event, gesture) => {
                if (this.state.backSpring){
                    Animated.spring(this.state.position, {
                        toValue: {x:0, y:0}
                    }).start(); //re-setting the position
                }
            }
        });

        this.state= {backSpring: true, position, panResponder, x:0};
    }

    componentWillUpdate() {
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        LayoutAnimation.spring();
    }

    render() {
        const { data } = this.props;

        return (
            <Animated.View style={[styles.wrapper, {...this.state.position.getLayout()}]} {...this.state.panResponder.panHandlers} >
                <View style={{flex:5}}>
                    <Text style={styles.shortcut}>{data.shortcut}</Text>
                    <Text style={styles.name}>{data.name}</Text>
                </View>

                <View style={{flex:7, alignContent: 'center'}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.timeStamps}>24H: </Text>
                        <Text 
                            style={data.h[0]==='-' ?styles.negativeChange :styles.possitiveChange}
                        >
                            {data.h.replace('-','')}%
                        </Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.timeStamps}>7D: </Text>
                        <Text 
                            style={data.d[0]==='-' ?styles.negativeChange :styles.possitiveChange}
                        >
                            {data.d.replace('-','')}%
                        </Text>
                    </View>                    
                </View>
                
                <View style={{flexDirection:'column', justifyContent: 'center', flex:2}}>
                    <Image source={{uri:data.icon}} style={{height: 33, width: 33}}/>
                </View>                
            </Animated.View>
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