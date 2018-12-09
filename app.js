const port = 3000;

const express = require('express');
const app = express();

const server = require('http').createServer(app);

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/index.html")
});

// Setup the server
server.listen(port, () => {
    console.log("Server running on port", server.address().port);
});

// Serve only files from within this folder
app.use(express.static('public'));