exports.userRoutes = function (app, db) {
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    app.post('/api/signup', (req, res) => {
        console.log("POST received on /signup");

        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;


        console.log("password length:", password.length);
        if (email && password && username) {
            // SELECT * FROM users WHERE email = '?' 
            db.User.query().select().where({ username }).then(userArray => {
                if (userArray.length > 0) {
                    res.send({ "status": 200, "response": "username is in use" })
                }
                bcrypt.hash(password, saltRounds).then(function (hash) {
                    // INSERT INTO users('email', 'password') VALUES('?', '?');
                    db.User.query().insert({ username, email, password: hash }).then(persistedData => {
                        req.session.isLoggedIn = true;
                        console.log(persistedData);
                        res.send({ "status": 200, "response": "everything went well" })
                    });
                });
            })
        } else {
            errorObj = { "errors": [] };
            if (!email)
                errorObj.errors.push("required attribute email is mising")
            if (!username)
                errorObj.errors.push("required attribute username is mising")
            if (!password)
                errorObj.errors.push("required attribute password is mising")
            const status = 400;
            res.status(status);
            res.send({ "status": status, "response": errorObj });
        }
    });
}