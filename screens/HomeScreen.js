import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Image, AsyncStorage, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';

import * as actions from '../actions'; 

import {fetchCryptos, fetchCryptoData} from '../api/cmc';
import {fetchCurrencies} from '../api/exchangeRates';
import {getStocksData} from '../api/alphaVantage';

import CryptoDisplay from '../components/CryptoDisplay';
import CurrencyDisplay from '../components/CurrencyDisplay';
import StockDisplay from '../components/StockDisplay';

class HomeScreen extends Component {   
    constructor(props) {
        super(props);
        this.state = { 
            title: 'crypto', 
            cryptos: '', 
            cryptoData: {}, 
            renderCrypto:false,
            currencies: '', 
            currencyData: {}, 
            renderCurrency:false,
            viewHeight: 53 ,
            showModal: false,
            modalInfo: {},
            stockData: {},
            renderStocks: false,
            stocks: ''
        };
    }

    static navigationOptions = ({navigation}) => {
        return {
            headerRight: () => 
                <TouchableOpacity 
                    onPress={() => navigation.navigate('Add')}
                    style={{marginRight: 10}}
                >
                    <Icon name='plus' size={30} />
                </TouchableOpacity>
            ,
            headerLeft: () => 
                <TouchableOpacity 
                    onPress={() => navigation.navigate('Settings')}
                    style={{marginLeft: 10}}
                >
                    <Icon name='settings' size={30} />
                </TouchableOpacity>
            
        };
    }

    deleteCrypto = async (symbol) => {
        let cryptoList = await AsyncStorage.getItem('cryptos');
        cryptoList = cryptoList.replace(symbol,'').replace(',,',',');
        if (cryptoList.slice(-1) === ',') {cryptoList = cryptoList.substring(0, cryptoList.length-1); }
        await AsyncStorage.setItem('cryptos', cryptoList);
        this.setState({cryptos: cryptoList});
    }

    getDataOfCrypto = async () => {
        let cryptoList = await AsyncStorage.getItem('cryptos');
        
        if (cryptoList){ this.setState({cryptos: cryptoList}); }

        if (this.state.cryptos !== ''){
            await getCryptoData(this.state.cryptos).then(data => this.setState({cryptoData: data}));
            this.setState({renderCrypto: true});
        }
    }

    getDataOfCurrency = async () => {
        let currencyList = await AsyncStorage.getItem('currencies');
        
        if (currencyList) {this.setState({currencies: currencyList});}
        
        if (this.state.currencies !== ''){
            await getCurrencyData(this.state.currencies).then(data => this.setState({currencyData: data})); 
            this.setState({renderCurrency: true});           
        }        
    }

    getDataOfStock = async () => {
        //await AsyncStorage.setItem('stocks', 'AAPL');
        let stockList = await AsyncStorage.getItem('stocks');

        //if (stockList) { this.setState({stocks: stockList}); }
        
        if(stockList){
            await getSData(stockList).then(data => this.setState({stocks: stockList, stockData: data,renderStocks: true}));
        }
    }

    getDataForModal = async (symbol) => {
        let data = await fetchCryptoData(symbol);  
        this.setState({modalInfo: {symbol, data}, showModal: true});
    }    

    componentWillMount() {
        this.getDataOfCrypto();
        this.getDataOfCurrency();
        this.getDataOfStock();
        this.setState({title: 'crypto'});
    }

    componentDidMount () {
        const {navigation} = this.props;
        navigation.addListener ('willFocus', () => {
            const title = this.state.title;
            switch (title){
                case 'crypto':
                    this.setState({ renderCrypto: false }); //wait with the render until the new data will be fetched
                    this.getDataOfCrypto();
                    break;
                case 'currency':                    
                    this.setState({ renderCurrency: false }); //wait with the render until the new data will be fetched
                    this.getDataOfCurrency();
                    break;
                case 'stocks':   
                    this.setState({ renderStocks: false }); //wait with the render until the new data will be fetched
                    this.getDataOfStock();
                    break;                
                }
            } 
        );
    }

    renderCrypto() {
        var {width} = Dimensions.get('window');
        return (
            <View>
                {this.state.renderCrypto 
                ?
                    <ScrollView>
                        {
                            this.state.cryptos.split(',').map((item) => {
                                return (
                                    <View 
                                        onLayout={(event) => this.setState({viewHeight:event.nativeEvent.layout.height})}                                           
                                        key={item} 
                                        style={{flexDirection: 'column', justifyContent:'center'}}
                                    >
                                        <View style={[styles.hidden, {width: width}]}>
                                            <Text style={styles.price}>
                                                    ${this.state.cryptoData[item].price}
                                            </Text>
                                            <View style={{alignItems: 'flex-end', flexDirection: 'row-reverse', flex: 1}}>
                                                <TouchableOpacity 
                                                    style={[styles.info, {height: 51}]}
                                                    onPress={() => {                                                        
                                                        this.getDataForModal(item);
                                                    }}
                                                >
                                                    <Icon style={{color: '#525151'}} name='info' size={32}/>
                                                </TouchableOpacity>
                                                
                                                <TouchableOpacity 
                                                    style={[styles.trash, {height: 51}]}
                                                    onPress={() => this.deleteCrypto(item)}
                                                >
                                                    <Icon style={{color: 'white'}} name='trash-2' size={32}/>
                                                </TouchableOpacity>                                                
                                                
                                            </View>
                                        </View>

                                        <CryptoDisplay  
                                                data={{
                                                    name: this.state.cryptoData[item].name,
                                                    shortcut: item,
                                                    h: String(this.state.cryptoData[item].percent_change_24h),
                                                    d: String(this.state.cryptoData[item].percent_change_7d),
                                                    icon: this.state.cryptoData[item].icon
                                                }}
                                        />                                        
                                        
                                    </View>   
                                )                        
                            })
                        }
                    </ScrollView> 
                : 
                    <ActivityIndicator size = 'large'/>
                }
            </View>
        );     
    }

    renderCurrency() {
        return (
            <View>
                {this.state.renderCurrency
                ?
                    <ScrollView>
                    {
                        this.state.currencies.split(',').map((item) => {
                            return (
                                <CurrencyDisplay                                             
                                        data={{
                                            value: this.state.currencyData[item].value,
                                            symbol: item,
                                        }}
                                        key = {item}
                                />                                   
                            )                        
                        })
                    }
                    </ScrollView> 
                :
                    <ActivityIndicator size = 'large'/>
                }
            </View>
        );
    }

    renderStocks() {
        return (
            <View>
                {this.state.renderStocks && this.state.stockData
                    ?
                        <ScrollView>
                        {
                            this.state.stocks.split(',').map((item) => {
                                return (
                                    <StockDisplay                                             
                                        data={this.state.stockData[item]}
                                        key = {item}
                                    />                                   
                                )                        
                            })
                        }
                        </ScrollView> 
                    :
                        <ActivityIndicator size = 'large'/>
                }
            </View>
        );
    }

    chooseRender() {
        switch (this.state.title){
            case 'crypto':
                return this.renderCrypto();
            case 'currency':
                return this.renderCurrency();
            case 'stocks':
                return this.renderStocks();
        }
    }

    render() {
        const modalData = this.state.modalInfo.data || {};
        const closeModal = () => this.setState({showModal: false});
        
        return (
            <View style={styles.wrapper}> 
                <Modal 
                    isVisible={this.state.showModal}
                    animationIn='slideInRight'
                    onBackdropPress={closeModal}
                    onBackButtonPress={closeModal}
                    onSwipeComplete={closeModal}
                    swipeDirection="right"
                    hideModalContentWhileAnimating={true}
                >
                    <View style={styles.modalWrapper}>
                        <TouchableOpacity onPress={closeModal} style={styles.modalButton}>
                            <Icon name='x-square' size={40}/>
                        </TouchableOpacity>
                        <Text style={styles.modalSymbol}> {this.state.modalInfo.symbol} </Text>
                        <Text style={styles.modalName}>{modalData.name || ''}</Text>
                        <Text style={styles.modalPrice}>Current Price: ${modalData.price || ''}</Text>
                        <Text style={styles.modalDescription}>{modalData.description || ''}</Text>
                        <Image source={{uri:modalData.logo}} style={styles.modalLogo}/>                        
                    </View>
                </Modal>

                <View style={styles.titleSelect}>
                    <TouchableOpacity onPress={ () => {this.setState({title: 'crypto'}); this.props.saveTitle('crypto');}}>
                        <Text 
                            style={this.state.title==='crypto' ?styles.selectedTitle :styles.titleText}
                        >
                            Crypto
                        </Text>
                    </TouchableOpacity>
                    
                    <Text style={{fontSize: 25, color: '#9da0a6'}}>|</Text>

                    <TouchableOpacity onPress={ () =>  {this.setState({title: 'stocks'}); this.props.saveTitle('stocks')}}>
                        <Text 
                            style={this.state.title==='stocks' ?styles.selectedTitle :styles.titleText}
                        >
                            Stocks
                        </Text>
                    </TouchableOpacity>
                    
                    <Text style={{fontSize: 25, color: '#9da0a6'}}>|</Text>

                    <TouchableOpacity onPress={ () =>  {this.setState({title: 'currency'}); this.props.saveTitle('currency')}}>
                        <Text 
                            style={this.state.title==='currency' ?styles.selectedTitle :styles.titleText}
                        >
                            Currency
                        </Text>
                    </TouchableOpacity>                    
                </View>  
                
                { this.chooseRender() }                         
            </View>
        );
    }
}

const getCryptoData = async (cryptos) => {
    let data = await fetchCryptos(cryptos);
    return data;
};

const getCurrencyData = async (currencies) => {
    let data = await fetchCurrencies(currencies);
    return data;
}

const getSData = async (stocks) => {
    let data = await getStocksData(stocks);
    return data;
}

const styles = StyleSheet.create({
    wrapper:{
        backgroundColor: '#F5F5F5',
        flex: 1,
        paddingTop: 10
    },
    titleSelect: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginHorizontal: 35,
        marginBottom: 20
    },
    titleText: {
        fontSize: 21,
        fontWeight: '500',
        color: '#9da0a6',
        paddingHorizontal: 5,
        paddingVertical: 3,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent'
    },
    selectedTitle: {
        fontSize: 21,
        fontWeight: '500',
        color: '#66B2FF',
        borderBottomColor: '#66B2FF',
        borderBottomWidth: 2,
        paddingHorizontal: 5,
        paddingVertical: 3,
    },
    price: {
        fontWeight: 'bold',
        fontSize: 15,
        marginLeft: 5,
    },
    trash: {
        backgroundColor: '#D60000',
        width: 40,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    info: {
        backgroundColor: '#b0aeae',
        width: 40,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    hidden: {
        position: 'absolute',
        zIndex: -1,
        flexDirection: 'row',
        flex: 1,
    },
    modalWrapper: {
        backgroundColor: '#a3bfba',
        borderRadius: 10,
        borderColor: 'transparent',
        borderWidth: 1,
    },
    modalButton: {
        alignSelf: 'flex-end', 
        marginRight: 5, 
        marginTop: 5
    },
    modalSymbol: {
        alignSelf:'center', 
        fontSize:22, 
        fontWeight: 'bold',
        marginBottom: 5
    },
    modalName: {
        alignSelf:'center', 
        fontSize:18, 
        color: 'white',
        marginBottom: 7
    },
    modalPrice: {
        alignSelf: 'center',
        fontSize: 15,
        marginBottom: 5,
        fontStyle: 'italic'
    },
    modalDescription: {
        paddingHorizontal: 10,
        textAlign: 'center'
    },
    modalLogo: {
        height: 55, 
        width: 55,
        marginTop: 15,
        alignSelf: 'center',
        marginBottom: 10
    }
});

function mapStateToProps({ title }) {
    return { title: title.title };
}

export default connect(mapStateToProps, actions)(HomeScreen);