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
const session = require('express-session');
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: false }
}));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = require('http').createServer(app);

const db = {
    User: require('./models/User')
};


app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/index.html")
});

app.get('/signup', function (req, res) {
    res.sendFile(__dirname + "/public/signup.html")
});

// Setup the server
server.listen(serverConfig.port, () => {
    console.log("Server running on port", server.address().port);
});

// Serve only files from within this folder
app.use(express.static('public'));

// Register api routes
const apiRoutes = require('./routes/api');
apiRoutes.apiRoutes(app, db);
