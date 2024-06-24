const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');
const {allAssets} = require("./assetModels");
const mongoDbUrl = "mongodb://localhost:27017/";
const dbName = 'userDatabase';
let adminAssets = null;
async function getUserFromDB(userInfoFromToken) {
    console.log("Fetching user from DB:", userInfoFromToken);
    const client = await MongoClient.connect(mongoDbUrl, {useUnifiedTopology: true});
    const db = client.db(dbName);
    const userFromDB = await db.collection("users").findOne({email: userInfoFromToken.name});
    await client.close(); // Schließen der Verbindung zur Datenbank
    console.log("User from DB:", userFromDB);
    return userFromDB;
}

async function initialiseDbFromAdmin() {
    const adminEmail = "admin@admin";
    const adminPassword = "admin";
    const keyArrays = Object.keys(allAssets)

    let adminUser = await getUserFromDB({name: adminEmail});

    if (!adminUser) {
        console.log("Admin user not found, creating admin user...");
        const client = await MongoClient.connect(mongoDbUrl, {useUnifiedTopology: true});
        const db = client.db(dbName);

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        await db.collection('users').insertOne({
            name: "admin",
            email: adminEmail,
            password: hashedPassword,
            assets: keyArrays,
            admin: true
        });

        adminUser = await getUserFromDB({name: adminEmail});
        await client.close(); // Schließen der Verbindung zur Datenbank
    }

    if (!adminUser) {
        throw new Error("Failed to create or fetch admin user.");
    }

  adminAssets = adminUser.assets;
    console.log("Admin Assets: ", adminAssets);
    console.log("Admin User: ", adminUser);
    return adminAssets
}

module.exports = {getUserFromDB, initialiseDbFromAdmin,adminAssets};
