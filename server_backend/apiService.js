const axios = require('axios');
const cryptoAssets = require('./assetModels');

const fetchPrices = async (symbol) => {
    try {
        const response = await axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD,JPY,EUR&api_key=db34a3799a2813ae847aa1145cdd903b1b7fc3aec63c1c1a1eec59435ca95c4c`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

module.exports = { fetchPrices, cryptoAssets };