const cryptoAssets = {
    BTC: {id: 'BTC', name: 'Bitcoin'},
    ETH: {id: 'ETH', name: 'Ethereum'},
    BNB: {id: 'BNB', name: 'Binance Coin'},
    XRP: {id: 'XRP', name: 'Ripple'},
    ADA: {id: 'ADA', name: 'Cardano'},
    DOGE: {id: 'DOGE', name: 'Dogecoin'},
    DOT: {id: 'DOT', name: 'Polkadot'},
    UNI: {id: 'UNI', name: 'Uniswap'},
    LTC: {id: 'LTC', name: 'Litecoin'},
    LINK: {id: 'LINK', name: 'Chainlink'}
};

module.exports = cryptoAssets;

const assetsInUse = {
    BTC: {
        id: 'BTC',
        asset: 'crypto',
        name: 'Bitcoin',
        price: null,
        logo: 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400'
    },
    ETH: {
        id: 'ETH',
        asset: 'crypto',
        name: 'Ethereum',
        price: null,
        logo: 'https://assets.coingecko.com/coins/images/279/standard/ethereum.png?1696501628'
    },
    DOGE: {
        id: 'DOGE',
        asset: 'crypto',
        name: 'Dogecoin',
        price: null,
        logo: 'https://assets.coingecko.com/coins/images/5/standard/dogecoin.png?1696501409'
    }
};

module.exports = assetsInUse;
