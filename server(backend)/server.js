const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const {all} = require("express/lib/application");
const app = express();

const { fetchData } = require('./apiService'); //für crypto api

// Parse urlencoded bodies
app.use(bodyParser.json());

// Serve static content in directory 'client(frontend)'
const staticFilesPath = path.join(__dirname, '..', 'client(frontend)');
app.use(express.static(staticFilesPath));

// Serve index.html when root route is accessed
// app.get('/', (req, res) => {
//     res.sendFile(path.join(staticFilesPath, 'index.html'));
// });

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