import axios from 'axios';

export const getStocksData = async (symbols) => {
    try {
        var data = {};

        symbols.split(',').map((symbol) => {
            getSingleData(symbol).then(result => data[symbol] = result);
        });
        await sleep(symbols.split(',').length * 1000);
        
        return data;
    } catch (err){
        console.log(err);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const getSingleData = async (symbol) => {
    let res = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=API-KEY`).catch(() => {});
    
    const changePercent = res.data["Global Quote"]["10. change percent"];
    const change = res.data["Global Quote"]["09. change"];
    const price = res.data["Global Quote"]["05. price"];  
    
    return { price, changePercent, change, symbol };            
}

export const searchStock = async (symbol) => {
    let res = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=API-KEY`)
    
    if (res.data["Error Message"]){ return;} //no results

    return {symbol};
}