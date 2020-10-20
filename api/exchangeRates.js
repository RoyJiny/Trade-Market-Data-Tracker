import axios from 'axios';

export const fetchCurrencies = async (symbols) => {
    try {
        let res = await axios.get('https://api.exchangeratesapi.io/latest?base=USD');

        var data = {};
        var s_array = symbols.split(',');
        for (let symbol of s_array) {
            const value = res.data.rates[symbol];
            
            data[symbol] = {value, symbol};
        }

        return data;
    } catch (err){
        console.log(err);
    }
}

export const searchCurrency = async (symbol) => {
    try {
        let res = await axios.get('https://api.exchangeratesapi.io/latest?base=USD');
        
        if (!Object.keys(res.data.rates).includes(symbol)){return;}

        const data = {symbol: symbol};

        return data;
    } catch (err){
        console.log(err);
    }
}