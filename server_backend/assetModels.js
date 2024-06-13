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
    BNB: {
        id: 'BNB',
        asset: 'crypto',
        name: 'BNB',
        price: null,
        logo: 'https://assets.coingecko.com/coins/images/825/standard/bnb-icon2_2x.png?1696501970'
    },
    SHIB: {
        id: 'SHIB',
        asset: 'crypto',
        name: 'Shiba Inu',
        price: null,
        logo: 'https://assets.coingecko.com/coins/images/11939/standard/shiba.png?1696511800'
    },
    USDT: {
        id: 'USDT',
        asset: 'crypto',
        name: 'Tether',
        price: null,
        logo: 'https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661'
    },
    XRP: {
        id: 'XRP',
        asset: 'crypto',
        name: 'XRP',
        price: null,
        logo: 'https://assets.coingecko.com/coins/images/44/standard/xrp-symbol-white-128.png?1696501442'
    },
    SOL: {
        id: 'SOL',
        asset: 'crypto',
        name: 'Solana',
        price: null,
        logo: 'https://assets.coingecko.com/coins/images/4128/standard/solana.png?1696504756'
    },
    PEPE: {
        id: 'PEPE',
        asset: 'crypto',
        name: 'Pepe',
        price: null,
        logo: 'https://assets.coingecko.com/coins/images/29850/standard/pepe-token.jpeg?1696528776'
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

module.exports = { assetsInUse, allAssets};