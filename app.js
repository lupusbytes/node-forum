const serverConfig = require('./config/server.json');

const express = require('express');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: false }
}));

// DB & ORM
const knexConfig = require('./knexfile');
const Knex = require('knex');
const { Model } = require('objection');
const knex = Knex(knexConfig.development);
Model.knex(knex);



const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = require('http').createServer(app);

const db = {
    User: require('./models/User'),
    Post: require('./models/Post'),
    Thread: require('./models/Thread'),
    Category: require('./models/Category')
};


app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/index.html")
});

app.get('/login', function (req, res) {
    res.sendFile(__dirname + "/public/login.html");
});

app.get('/logout', function (req, res) {
    res.sendFile(__dirname + "/public/logout.html");
});

app.get('/signup', function (req, res) {
    res.sendFile(__dirname + "/public/signup.html")
});

app.get('/forum', function (req, res) {
    res.sendFile(__dirname + "/public/forum.html");
})

// Setup the server
server.listen(serverConfig.port, () => {
    console.log("Server running on port", server.address().port);
});

// Serve only files from within this folder
app.use(express.static('public'));

// Register api routes
const apiRoutes = require('./routes/api');
apiRoutes.apiRoutes(app, db);
