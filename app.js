const serverConfig = require('./config/server.json');
const knexConfig = require('./knexfile');

const Knex = require('knex');
const { Model } = require('objection');

// Initialize knex.
const knex = Knex(knexConfig.development);

// Bind all Models to a knex instance.
Model.knex(knex);


const express = require('express');
const app = express();

const server = require('http').createServer(app);

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/index.html")
});

// Setup the server
server.listen(serverConfig.port, () => {
    console.log("Server running on port", server.address().port);
});

// Serve only files from within this folder
app.use(express.static('public'));
