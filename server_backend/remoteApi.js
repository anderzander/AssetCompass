let {allAssets, allAssetsByAdmin, allArticles} = require("./assetModels");

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
function getGoldPrice(){
    const url ='https://api.gold-api.com/price/XAU';
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const id = "GOLD";
        allAssets[id].price = parseFloat(data.price).toFixed(2);

        })
        .catch(error=> {
            console.error('There was a problem with the fetch operation:', error);
        })
}
function financeNews() {
    const apiKey = '1e6b48ba1dd4648eacc3f0d48f56421f';
    const url = `https://gnews.io/api/v4/top-headlines?category=business&lang=en&country=us&max=10&apikey=${apiKey}`;
    let articles = null;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            //console.log("in finance news" + JSON.stringify(allArticles))

            data.articles.forEach((article, index) => {
                // Use the index or any unique identifier as the key
                allArticles[`article${index + 1}`] = article;
            });


        })
        .catch(error => {
            console.error('Error fetching finance news:', error);
        });
}

function refreshPrice() {
    getGoldPrice()
    financeNews()

    Object.keys(allAssets).forEach(key => {

        //todo es werden nur crypto assets aktualisiert, für alle anderen Assets werden die statischen price verwendet!!
        if (allAssets[key].asset === 'crypto') {
            getCryptoValue(key);
            getHistoricalDataForCrypto(key, 'EUR', 30);
        }
    })
}
module.exports =  {getHistoricalDataForCrypto, getCryptoValue,refreshPrice};