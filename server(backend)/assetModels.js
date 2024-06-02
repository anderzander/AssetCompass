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


const assetsInUse = {
    BTC: {
        id: 'BTC',
        asset: 'crypto',
        name: 'Bitcoin',
        price: null,
        logo: 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400'
    }
};


const allAssets = {
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
        logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAA4CAMAAABTwfHHAAAAaVBMVEX////oISfmAAD4z8/nAAvxj5D//PzynJ34zMznCRTxjY/++Pj98PDoHSPsV1rxlJb62tr85+fpNjvoFRz2urv1sbLzoqP2v8DtZ2n3xMXrSk30qKnpLjLwh4jsW17ve33rUFPucHLqQ0Y3JTvsAAACFElEQVRIie2W25akIAxFMYKKiqiU91tV/f9HTmK0umpW95J+nTXnxQhbIPGACvGmKmnsox/rIJjrsd9sk+TiO4Vx4QDkpwDcGocfXNb0Owb6+VBtc+u67ta06eMp91bob9lBdj1ILaFWA80YnQNEFOVDWu+9/bA3jlLDik/mg+1rAMN0pgHq3g4ZzrqCliuv1E2RCJcZn3cmCFzBI7ggMA5HnNNSZK0uj+ly5YAwllywadPnrXFg7KseOWgCDQ4CgAHcxIRXg3fy6IEzOVECtug67sKycgTv6FyVYWdrnMBB9fYSaqkVh3caiBbgHtywaHh+vpIJjmBxxzp1fBQfmm9fHqo5k5LDT8hLJRzs+xp/UHay8hIVYuZCm9GD7Tk5t3mwlpPTkwfbSU4tvEZFxcnB91viLzGrfVDxpEK41YvdqBBOebETFULevNhk93B5DQqyPrHRNUgyJjC1HyoK8zL6pVL3MvqlGuljdBba3cPorAhZTxTt7nyMznpIH6OzYvAxOmvwMjqr8jM6y78MmNwv2OQX7H/9U4pTZVWKJ12+pCj6FjcKteDuHI7dXO5drSiVBaXo9OpsHFsyebG1cdxhkJ6nxERd+9Zmt+ZDgiKkaEOM0O7qYPMkRO2n4fER38b7faTetCiKFZIvNoRxHOv1i+WD8XU8rsxGKBHeadFvbDbj/wLQT8lCAY1rgf6XcmbD9Q/BthlPhylD9QAAAABJRU5ErkJggg=='
    }

};

module.exports = {cryptoAssets, assetsInUse, allAssets};