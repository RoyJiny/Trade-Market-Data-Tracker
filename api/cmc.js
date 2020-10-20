const CoinMarketCap = require('coinmarketcap-api');

const apiKey = 'API-KEY';
const client = new CoinMarketCap(apiKey);

//gets a string of symbols 'BTC,ETH,...' and returns their data from the api as an object (the symbol is the key)
export const fetchCryptos = async (symbols) => {
    try {        
        let res = await client.getQuotes({symbol: symbols});
        let res2 = await client.getMetadata({symbol: symbols});

        var data = {};
        var s_array = symbols.split(',');
        for (let symbol of s_array) {
            const iconUrl = res2.data[symbol].logo;
            const { name, quote } = res.data[symbol];
            const {
                percent_change_24h,
                percent_change_7d,
                price
            } = quote.USD;

            data[symbol] = {name, symbol, percent_change_24h, percent_change_7d, price, icon: iconUrl};
        }

        return data;
    } catch (err){
        console.log(err.message);
    }
}

//gets a string symbol and returns its data as object {name, symbol, price}
export const searchCrypto = async (symbol) => {
    try {        
        let res = await client.getQuotes({symbol});
        let res2 = await client.getMetadata({symbol});

        if(res.status.error_code !==0 ){return;} //no results
        
        const { name, quote } = res.data[symbol];
        const { price } = quote.USD;
        const iconUrl = res2.data[symbol].logo;

        data = {name, symbol, price, iconUrl};      
       
        return data;
    } catch (err){
        console.log(err.message);
    }
}

export const fetchCryptoData = async (symbol) => {
    try{
        let res = await client.getMetadata({symbol});
        let res2 = await client.getQuotes({symbol});

        if(res.status.error_code !==0 ){return;} //no results

        const {name, logo, description} = res.data[symbol];
        const { quote:{USD: {price}} } = res2.data[symbol];
        
        return {name, logo, description, price};
    } catch(err){
        console.log(err);
    }
}