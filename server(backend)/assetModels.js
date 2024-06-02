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


const assetsInUse = {};


const allAssets = {
    BTC: {
        id: 'BTC',
        asset: 'crypto',
        name: 'Bitcoin',
        price: null,
        historicalPrice: [],
        historicalDate: [],
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
    },
    ADA: {
        id: 'ADA',
        asset: 'crypto',
        name: 'Cardano',
        price: null,
        logo: 'https://assets.coingecko.com/coins/images/975/standard/cardano.png?1696502090'
    },
    TSLA: {
        id: 'TSLA',
        asset: 'stock',
        name: 'Tesla',
        price: '161.54',
        logo: 'https://pngimg.com/d/tesla_logo_PNG12.png'
    },
    AMZN: {
        id: 'AMZN',
        asset: 'stock',
        name: 'Amazon',
        price: '161.02',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg'
    }

};

module.exports = {cryptoAssets, assetsInUse, allAssets};