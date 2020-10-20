import React, { Component } from 'react';
import { View, StyleSheet, TextInput, AsyncStorage, ActivityIndicator, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {connect} from 'react-redux';

import {searchCrypto} from '../api/cmc';
import {searchCurrency} from '../api/exchangeRates';
import {searchStock} from '../api/alphaVantage';

import SearchResult from '../components/SearchResult';

class AddScreen extends Component {  
  constructor(props) {
    super(props);
    this.state = { loading: false, searchTerm: '' };
  }

  search = async (term,title) => {
    this.setState({loading: true});
    let data;
    switch (title){
      case 'crypto':{
        data = await searchCrypto(term);
        this.setState({lastSearchCrypto: data, loading: false}); 
        break;
      }
      case 'currency':{
        data = await searchCurrency(term);
        this.setState({lastSearchCurrency: data, loading: false}); 
        break;
      }
      case 'stocks':{
        data = await searchStock(term);
        this.setState({lastSearchStock: data, loading: false});
        break;
      }
  }
       
  }

  saveResult = async (symbol, type) => {
    const { navigation } = this.props;
    let list;
    switch (type){
      case 'crypto':
        list = await AsyncStorage.getItem('cryptos');
        if (list){
          list = `${list},${symbol}`;
        } else { //the first one we add
          list = symbol
        }
        await AsyncStorage.setItem('cryptos', list);
        navigation.navigate('Home');
        break;
      
      case 'currency':
        list = await AsyncStorage.getItem('currencies');
        if (list){
          list = `${list},${symbol}`;
        } else { //the first one we add
          list = symbol
        }
        await AsyncStorage.setItem('currencies', list);
        navigation.navigate('Home');
        break;

      case 'stock':
        list = await AsyncStorage.getItem('stocks');
        if (list){
          list = `${list},${symbol}`;
        } else { //the first one we add
          list = symbol
        }
        await AsyncStorage.setItem('stocks', list);
        navigation.navigate('Home');
        break;
    }
  }

  renderCrypto() {
    return (
      <View style={styles.wrapper}>

        <View style={styles.searchBar}>
          <Icon name='search' size={30} style={{marginLeft:10, alignSelf:'center'}}/>
          <TextInput 
            autoCapitalize = 'characters'
            autoFocus
            autoCorrect={false}
            placeholder='Search crypto'
            style={{flex:1, marginLeft: 7, fontSize:16}}
            value={this.state.serachTerm} 
            onChangeText={text => this.setState({searchTerm: text})}
            onSubmitEditing={() => this.search(this.state.searchTerm, 'crypto')}
          />
        </View>

        {
          this.state.loading
            ? <ActivityIndicator size='large'/>
            : null          
        }

        {
          this.state.lastSearchCrypto
          ? <View style={{ marginTop: 40 }}>
            <SearchResult
              type={'crypto'}  
              data={{ 
                name: this.state.lastSearchCrypto.name, 
                shortcut: this.state.lastSearchCrypto.symbol,
                icon: this.state.lastSearchCrypto.iconUrl
              }}
              onClick={this.saveResult}
            />
          </View>
          : <Text style={styles.noResults}>No Results Found</Text>
        }
      </View>
    );
  }

  renderCurrency() {
    return (
      <View style={styles.wrapper}>

        <View style={styles.searchBar}>
          <Icon name='search' size={30} style={{marginLeft:10, alignSelf:'center'}}/>
          <TextInput 
            autoCapitalize = 'characters'
            autoFocus
            autoCorrect={false}
            placeholder='Search currency'
            style={{flex:1, marginLeft: 7, fontSize:16}}
            value={this.state.serachTerm} 
            onChangeText={text => this.setState({searchTerm: text})}
            onSubmitEditing={() => this.search(this.state.searchTerm, 'currency')}
          />
        </View>

        {
          this.state.loading
            ? <ActivityIndicator size='large'/>
            : null          
        }

        {
          this.state.lastSearchCurrency
          ? <View style={{ marginTop: 40 }}>
            <SearchResult
              type={'currency'}
              data={{ 
                symbol: this.state.lastSearchCurrency.symbol, 
                value: this.state.lastSearchCurrency.value,
              }}
              onClick={this.saveResult}
            />
          </View>
          : <Text style={styles.noResults}>No Results Found</Text>
        }
      </View>
    );
  }

  renderStocks() {
    return (
      <View style={styles.wrapper}>

        <View style={styles.searchBar}>
          <Icon name='search' size={30} style={{marginLeft:10, alignSelf:'center'}}/>
          <TextInput 
            autoCapitalize = 'characters'
            autoFocus
            autoCorrect={false}
            placeholder='Search Stocks'
            style={{flex:1, marginLeft: 7, fontSize:16}}
            value={this.state.serachTerm} 
            onChangeText={text => this.setState({searchTerm: text})}
            onSubmitEditing={() => this.search(this.state.searchTerm, 'stocks')}
          />
        </View>

        {
          this.state.loading
            ? <ActivityIndicator size='large'/>
            : null          
        }

        {
          this.state.lastSearchStock
          ? <View style={{ marginTop: 40 }}>
            <SearchResult
              type={'stock'}  
              data={{ 
                symbol: this.state.lastSearchStock.symbol
              }}
              onClick={this.saveResult}
            />
          </View>
          : <Text style={styles.noResults}>No Results Found</Text>
        }
      </View>
    );
  }

  render() {   
    const title = this.props.title;
    switch (title){
      case 'crypto':
        return this.renderCrypto();
      case 'currency':
        return this.renderCurrency();
      case 'stocks':
        return this.renderStocks();
      default:
        return null;
    }
  }
}

const styles = StyleSheet.create({
  wrapper:{
    backgroundColor: '#F5F5F5',
    flex: 1,
    paddingTop: 10,    
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#8b8e94',
    marginHorizontal: 30,
    height: 40
  },
  noResults: {
    textAlign: 'center',
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#8b8e94'
  }
})

function mapStateToProps({title}) {
  return {title: title.title}
}

export default connect(mapStateToProps)(AddScreen);