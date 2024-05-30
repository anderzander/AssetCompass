const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const {all} = require("express/lib/application");
const app = express();

const { fetchData } = require('./apiService'); //für crypto api

var bitcoinValue;

// Parse urlencoded bodies
app.use(bodyParser.json());

// Serve static content in directory 'client(frontend)'
const staticFilesPath = path.join(__dirname, '..', 'client(frontend)');
app.use(express.static(staticFilesPath));


app.get('/currency', function (req, res) {
    getBitcoinValue();
    res.send(bitcoinValue);
})


function getBitcoinValue(){
    const url = 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=EUR&api_key=db34a3799a2813ae847aa1145cdd903b1b7fc3aec63c1c1a1eec59435ca95c4c';

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
            console.log(data); // For example, log it to the console
            bitcoinValue = data;
        })
        .catch(error => {
            // Handle any errors that occur during the fetch
            console.error('There was a problem with the fetch operation:', error);
        });
}

app.get('/api/data', async (req, res) => {
    try {
        const data = await fetchData();
        console.log("api in server geholt");
        //console.log(res.json(data));
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});


app.listen(3000, () => {
    console.log("Server now listening on http://localhost:3000/");
});