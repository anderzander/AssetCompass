const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const {all} = require("express/lib/application");
const app = express();
const {assetsInUse, allAssets, SignInTestAssets} = require('./assetModels.js');
const {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} = require('./secretTokens.js');
const MongoClient = require('mongodb').MongoClient
const mongoDbUrl = "mongodb://localhost:27017/";
const dbName = 'userDatabase'
const bcrypt = require("bcrypt")
const swaggerUi = require('swagger-ui-express');
const YAML = require('js-yaml');
const fs = require('fs');
const jwt = require("jsonwebtoken")
const cookieParser = require('cookie-parser');
const swaggerDocument = YAML.load(fs.readFileSync(path.join(__dirname, 'swagger.yaml'), 'utf8'));

//Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Parse urlencoded bodies
app.use(bodyParser.json());
app.use(cookieParser());

// Serve static content in directory 'client_frontend'
const staticFilesPath = path.join(__dirname, '..', 'client_frontend');
app.use(express.static(staticFilesPath));

app.listen(3000, () => {
    console.log("Server now listening on http://localhost:3000/");
});

app.post("/login", async (req, res) => {
    const userData = req.body;
    const client = await MongoClient.connect(mongoDbUrl);
    const db = client.db(dbName);

    const user = await db.collection('users').findOne({email: userData.email});

    if (!user) {
        return res.status(401).send('user does not exist')
    }

    if (user && await bcrypt.compare(userData.password, user.password)) {

        //create JWT TOKEN which expires in 30 min and sent it with a cookie to the client
        const accessToken = jwt.sign({name: user.name}, ACCESS_TOKEN_SECRET, {expiresIn: '30m'});
        res.cookie("token", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })
        res.status(200);
        res.json({accessToken: accessToken})
    } else {
        res.status(401).send('invalid password');
    }
})


app.post("/signup", async (req, res) => {
    try {
        const userData = req.body;
        const client = await MongoClient.connect(mongoDbUrl);
        const db = client.db(dbName);


        const existingUser = await db.collection("users").findOne({email: userData.email});
        if (existingUser) {
            return res.status(400).json({message: "User already exists"});
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(userData.password.toString(), salt)

        await db.collection("users").insertOne({
            name: userData.name,
            email: userData.email,
            password: hashedPassword
        });

        res.status(201).json({message: "User created successfully"});
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({message: "Internal server error"});
    }
});


app.get('/assets', (req, res) => {
    try {
        refreshPrice();
        res.status(200).json(assetsInUse);
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }

})

//test Endpoint with authorization
app.get('/assetsUser', authenticateToken, (req, res) => {
    try {
        refreshPrice();
        res.status(200).json(SignInTestAssets);
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }

})

app.get('/assets/all', function (req, res) {
    try {
        refreshPrice();
        res.status(200)
        res.send(allAssets);
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }

})


app.delete('/asset/:id', (req, res) => {
    try {
        const resourceId = req.params.id;
        delete assetsInUse[resourceId];
        res.status(200).json({message: 'Resource deleted successfully'});
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }

})

app.post('/asset/:id', (req, res) => {
    const resourceId = req.params.id;
    if (allAssets.hasOwnProperty(resourceId)) { // Überprüfen, ob das Asset existiert
        res.status(200).json({message: 'Resource added successfully'});
        assetsInUse[resourceId] = allAssets[resourceId];
    } else {
        res.status(400).json({message: 'Resource not added, something went wrong.'});
    }
})


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

function refreshPrice() {
    Object.keys(allAssets).forEach(key => {
        //todo es werden nur crypto assets aktualisiert, für alle anderen Assets werden die statischen price verwendet!!
        if (allAssets[key].asset === 'crypto') {
            getCryptoValue(key);
            getHistoricalDataForCrypto(key, 'EUR', 30);
        }
    })
}

function authenticateToken(req, res, next) {
    const token = req.cookies.token
    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log(err)
        }
        if (err) return res.sendStatus(403)
        console.log(user.name)
        req.user = user
        next()
    })
}


refreshPrice();

