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
    Category: require('./models/Category'),
    Message: require('./models/Message')
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
});

app.get('/forum/categories/:category_id', function (req, res) {
    res.sendFile(__dirname + "/public/category.html");
});

app.get('/forum/categories/:category_id/threads/:thread_id', function (req, res) {
    res.sendFile(__dirname + "/public/thread.html");
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


const socket = require('socket.io');
var io = socket(server);
io.on('connection', function (socket) {
    // On connect, send last 25 messages
    db.Message.query().select().eager('creator').orderBy('created_at', 'desc').limit(25).then(messages => {
        messages.reverse();
        for (i = 0; i < messages.length; i++) {
            const payload = { message: messages[i].text, username: messages[i].creator.username, timestamp: messages[i].created_at };
            socket.emit('chat', payload);
        }
    });
    

    // Broadcast message
    socket.on('chat', function (data) {
        const userId = parseInt(data.userId);
        db.User.query().select().where({ id: userId }).then(users => {
            db.Message.query().insert({ text: data.message, created_by: userId }).then(() => {
                const user = users[0];
                data.timestamp = new Date();
                data.username = user.username;
                io.emit('chat', data);
            });
        });
    });
});
