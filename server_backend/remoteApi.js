const {allAssets} = require("./assetModels");

function getHistoricalDataForCrypto(id, currency, limit) {
    const url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${id}&tsym=${currency}&limit=${limit}`;

// Make a GET request to the URL
    fetch(url)
        .then(response => {
            // Check if the response is ok (status code 200-299)
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // Parse the JSON from the response
        })
        .then(data => {
            // Handle the data from the response
            let timeArray = [];
            let valueArray = [];

            data.Data.Data.forEach(item => {
                // Zeitstempel in Datum umwandeln
                let date = new Date(item.time * 1000);
                let formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                timeArray.push(formattedDate);

                // "high" Wert speichern
                valueArray.push(item.high);

                allAssets[id].historicalDate = timeArray;
                allAssets[id].historicalPrice = valueArray;

            });
        })
        .catch(error => {
            // Handle any errors that occur during the fetch
            console.error('There was a problem with the fetch operation:', error);
        });
}

function getCryptoValue(id) {
    const url = `https://min-api.cryptocompare.com/data/price?fsym=${id}&tsyms=EUR&api_key=db34a3799a2813ae847aa1145cdd903b1b7fc3aec63c1c1a1eec59435ca95c4c`;

// Make a GET request to the URL
    fetch(url)
        .then(response => {
            // Check if the response is ok (status code 200-299)
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // Parse the JSON from the response
        })
        .then(data => {
            // Handle the data from the response
            allAssets[id].price = data.EUR;
        })
        .catch(error => {
            // Handle any errors that occur during the fetch
            console.error('There was a problem with the fetch operation:', error);
        });
}

function refreshPrice() {
    Object.keys(allAssets).forEach(key => {
        //todo es werden nur crypto assets aktualisiert, für alle anderen Assets werden die statischen price verwendet!!
        if (allAssets[key].asset === 'crypto') {
            getCryptoValue(key);
            getHistoricalDataForCrypto(key, 'EUR', 30);
        }
    })
}

module.exports =  {getHistoricalDataForCrypto, getCryptoValue, refreshPrice}