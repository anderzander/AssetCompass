const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const {all} = require("express/lib/application");
const app = express();
const {fetchData} = require('./apiService'); //für crypto api
const {cryptoAssets, assetsInUse, allAssets} = require('./assetModels.js');

var currentAssetValue;

// Parse urlencoded bodies
app.use(bodyParser.json());

// Serve static content in directory 'client(frontend)'
const staticFilesPath = path.join(__dirname, '..', 'client(frontend)');
app.use(express.static(staticFilesPath));

app.get('/assets', function (req, res) {
    refreshPrice();
    res.send(assetsInUse);
})

app.get('/assets/all', function (req, res) {
    refreshPrice();
    res.send(allAssets);
})

app.get('/currency', function (req, res) {
    getCryptoValue('ETH');
    console.log("send Api Data do client" + currentAssetValue)
    res.send(currentAssetValue);
})

app.get('/api/data', async (req, res) => {
    try {
        const data = await fetchData();
        console.log("api in server geholt");
        //console.log(res.json(data));
        res.json(data);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch data'});
    }
});


app.delete('/asset/:id', (req, res) => {
    const resourceId = req.params.id;
    console.log(resourceId);
    delete assetsInUse[resourceId];
    res.status(200).json({message: 'Resource deleted successfully'});
})

app.post('/asset/:id', (req, res) => {
    const resourceId = req.params.id;
    console.log(resourceId);
    if (allAssets.hasOwnProperty(resourceId)) { // Überprüfen, ob das Asset existiert
        res.status(200).json({message: 'Resource added successfully'});
        assetsInUse[resourceId] = allAssets[resourceId];
    } else {
        res.status(400).json({message: 'Resource not added, something went rong'});
    }
})

app.listen(3000, () => {
    console.log("Server now listening on http://localhost:3000/");
});


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
            console.log("got data from API " + data.EUR); // For example, log it to the console
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
        }
    })
}

//refreshPrice();
