const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const {all} = require("express/lib/application");
const app = express();
let {allAssets,adminAssets} = require('./assetModels.js');
const {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, authenticateToken} = require('./sassionManagement.js');
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
const {refreshPrice} = require("./remoteApi");
const {getUserFromDB, initialiseDbFromAdmin, getAdminAssets} = require('./DatabaseLogic.js');
let assetsForUser = null;



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

        const accessToken = jwt.sign({name: user.email}, ACCESS_TOKEN_SECRET, {expiresIn: '30m'});
        res.cookie("token", accessToken, {})
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
            password: hashedPassword,
            assets: [],
            admin: false
        });

        res.status(201).json({message: "User created successfully"});
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({message: "Internal server error"});
    }
});


app.get('/assets', authenticateToken, async (req, res) => {
    const eMailFromToken = req.user
    let assetsInUse = {};

    try {
        const userFromDb = await getUserFromDB(eMailFromToken)
        if (userFromDb.admin === false) {
            console.log("/assets as normal user")
            userFromDb.assets.forEach(function (str) {
                assetsInUse[str] = allAssets[str]
            })
            res.status(200).json(assetsInUse);
        } else if (userFromDb.admin === true) {
            console.log("/assets as admin")
            userFromDb.assets.forEach(function (str) {
                assetsInUse[str] = allAssets[str]
            })
            res.status(200).json(assetsInUse);
        }

    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
})


app.get('/assets/all', authenticateToken, async (req, res) => {
    assetsForUser = await initialiseDbFromAdmin();
        const eMailFromToken = req.user
        console.log("assets all reached")
    console.log(adminAssets)
        try {
            refreshPrice();
            res.status(200)
            const userFromDb = await getUserFromDB(eMailFromToken)
            if (userFromDb.admin === false) {
                const stringifyedAssetsForUser = JSON.stringify(assetsForUser)
                res.send(stringifyedAssetsForUser);

            } else if (userFromDb.admin === true) {
                res.send(allAssets);
            }

        } catch
            (error) {
            res.status(500).json({message: "Internal server error test"});
        }
    }
)


app.delete('/asset/:id', authenticateToken, async (req, res) => {
    const resourceId = req.params.id;
    const eMailFromToken = req.user
    console.log("entering delete as : " + eMailFromToken.name)


    try {
        const userFromDb = await getUserFromDB(eMailFromToken)
        if (userFromDb.admin === false) {
            const client = await MongoClient.connect(mongoDbUrl);
            const db = client.db(dbName);
            await db.collection("users").updateOne(
                {email: userFromDb.email}, // Filter criteria to find the document
                {$pull: {assets: resourceId}} // Update operation using $addToSet without duplicates
            );
            console.log("deleted as normal user")
            res.status(200).json({message: 'Resource removed successfully by user'});
        } else if (userFromDb.admin === true) {
            const client = await MongoClient.connect(mongoDbUrl);
            const db = client.db(dbName);
            await db.collection("users").updateOne(
                {email: userFromDb.email}, // Filter criteria to find the document
                {$pull: {assets: resourceId}} // Update operation using $addToSet without duplicates
            );
            console.log("deleted as admin user")
            res.status(200).json({message: 'Resource removed successfully by admin'});
        }
    } catch (error) {
        res.status(400).json({message: 'Resource not added, something went wrong.'});
    }


})

app.post('/asset/:id', authenticateToken, async (req, res) => {
    const resourceId = req.params.id;
    const user = req.user
    console.log("in Post " + user.name)

    try {
        const client = await MongoClient.connect(mongoDbUrl);
        const db = client.db(dbName);
        await db.collection("users").updateOne(
            {email: user.name}, // Filter criteria to find the document
            {$addToSet: {assets: resourceId}} // Update operation using $addToSet without duplicates
        );
        res.status(200).json({message: 'Resource added successfully'});
    } catch (error) {
        res.status(400).json({message: 'Resource not added, something went wrong.'});
    }
})

refreshPrice();







