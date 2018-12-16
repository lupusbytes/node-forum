exports.apiRoutes = function (app, db) {
    const bcrypt = require('bcrypt');
    const serverConfig = require('../config/server.json');

    app.post('/api/auth', (req, res) => {
        console.log("POST recieved on /api/auth")

        const username = req.body.username;
        const password = req.body.password;

        const authFailedStatus = 401;
        const authFailObject = { "status": authFailedStatus, "message": "incorrect username or password" };

        if (username && password) {
            db.User.query().select().where({ username }).then(userArray => {
                if (userArray.length == 1) {
                    console.log(userArray);
                    if (bcrypt.compare(password, userArray[0].password)) {
                        req.session.isLoggedIn = true;
                        req.session.username = username;
                        // Return HTTP Status 200 - OK
                        const status = 200;
                        res.status(status);
                        res.send({ "status": status, "message": "successfully logged in" })
                    } else {
                        res.status(authFailedStatus);
                        res.send(authFailObject)
                    }

                } else if (userArray.length == 0) {
                    // No matching username
                    res.status(authFailedStatus);
                    res.send(authFailObject)
                } else {
                    // If userArray.length has not matched with 0 or 1, it means we have a duplicated username ...
                    // Return HTTP Status 500 - Internal Server Error
                    const status = 500;
                    res.status(status);
                    res.send({ "status": status, "message": "duplicate username in database, please contact an admin" })
                }
            })
        }
    });

    /* The HTTP request method could easily be argued here.
     * Seeing as we only need to destroy the serverside cookie and handle no external data, GET will suffice. */
    app.get('/api/logout', (req, res) => {
        console.log("GET recieved on /api/auth")
        const username = req.session.username;
        if (req.session.isLoggedIn) {
            db.User.query().update({
                last_online: new Date().toISOString()
            }).where('username', username).then();
            req.session.destroy();
            // Return HTTP Status 200 - OK
            const status = 200;
            res.status(status);
            res.send({ "status": status, "message": "successfully logged out" })
        } else {
            // Return Http Status 401 - Unathorized
            const status = 401;
            res.status(status);
            res.send({ "status": status, "message": "you were not logged in" })
        }
    });


    app.post('/api/users', (req, res) => {
        console.log("POST received on /api/user");

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
                            req.session.username = username;
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
    app.get('/api/categories', (req, res) => {
        db.Category.query().select().then(categories => {
            //console.log(categories);
            let payload = [];
            for (i = 0; i < categories.length; i++) {
                // Find thread with latest activity
                var categoryId = categories[i].id;
                var categoryName = categories[i].name
                var thread = (async function(id) {
                    return await b.Thread.query().select().orderBy('last_activity').limit(1);
                });
                console.log(thread);
                payload.push({
                    id: categoryId,
                    name: categoryName,
                    latestThread: thread[0],
                    //threadCount: categories[i].threads.length
                });

                //dates.reduce(function (a, b) { return a > b ? a : b; });
            }
            console.log(payload);
            // Return HTTP Status 200 - OK
            const status = 200;
            res.status(200);
            res.send({ "status": status, data: payload });
        });
    });
    
}