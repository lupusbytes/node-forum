exports.apiRoutes = function (app, db) {
    const bcrypt = require('bcrypt');
    const serverConfig = require('../config/server.json');
    
    app.post('/api/signup', (req, res) => {
        console.log("POST received on /api/signup");

        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;

        if (email && password && username) {
            // SELECT * FROM users WHERE username = '?' 
            db.User.query().select().where({ username }).then(userArray => {
                // Check if an user with that username already exists
                if (userArray.length > 0) {
                    // Return HTTP Status 409 - Conflict
                    const status = 409;
                    res.status(status)
                    res.send({ "status": status, "message": "username is in use" })
                } else {
                    bcrypt.hash(password, serverConfig.bcryptIterations).then(function (hash) {
                        // INSERT INTO users('email', 'password') VALUES('?', '?');
                        db.User.query().insert({ username, email, password: hash }).then(persistedData => {
                            req.session.isLoggedIn = true;
                            console.log(persistedData);

                            // Return HTTP Status 201 - Created
                            const status = 201;
                            res.status(status)
                            res.send({ "status": status, "message": "user has been succesfully created" })
                        });
                    });
                }
            })
        } else {
            errorObj = { "errors": [] };
            if (!email)
                errorObj.errors.push("required attribute email is mising")
            if (!username)
                errorObj.errors.push("required attribute username is mising")
            if (!password)
                errorObj.errors.push("required attribute password is mising")

            // Return HTTP Status 400 - Bad Request
            const status = 400;
            res.status(status);
            res.send({ "status": status, "response": errorObj });
        }
    });
}