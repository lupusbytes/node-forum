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
                    if (bcrypt.compare(password, userArray[0].password)) {
                        req.session.isLoggedIn = true;
                        req.session.userId = userArray[0].id;
                        req.session.username = username;

                        const payload = { "username": username, "userId": userArray[0].id }

                        // Return HTTP Status 200 - OK
                        const status = 200;
                        res.status(status);
                        res.send({ "status": status, "message": "successfully logged in", data: payload })
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
                last_activity: new Date()
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
                            req.session.userId = persistedData.id;
                            const payload = { "username": username, userId: persistedData.id }

                            // Return HTTP Status 201 - Created
                            const status = 201;
                            res.status(status)
                            res.send({ "status": status, "message": "user has been succesfully created", "data": payload })
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
        console.log("GET received on /api/categories");
        
        db.Category.query().select().eager('threads').then(categories => {
            // This query could be optimized, instead of looping the eagerly loaded threads,
            // we could create a more intelligent SQL to retrieve the latest thread for each category_id
            let payload = [];
            for (let i = 0; i < categories.length; i++) {
                payload.push({
                    id: categories[i].id,
                    name: categories[i].name,
                    latestThread: getThreadWithLatestActivity(categories[i].threads),
                    threadCount: categories[i].threads.length
                });
            }
            const status = 200;
            res.status(status);
            res.send({ "status": status, data: payload });
        });
    });

    function getThreadWithLatestActivity(data) {
        let latest = 0;
        for (let i = 1; i < data.length; i++) {
            if (new Date(data[i].last_activity) > new Date(data[latest].last_activity)) {
                latest = i;
            }
        }
        return data[latest];
    }

    app.get('/api/categories/:category_id', (req, res) => {
        const categoryId = parseInt(req.params.category_id);
        console.log("GET received on /api/categories/" + categoryId);

        db.Category.query().select().where({ id: categoryId }).then(categories => {
            if (categories.length == 1) {
                // Return HTTP Status 200 - OK
                const status = 200;
                res.status(status);
                res.send({ "status": status, data: categories[0] });
            } else {
                // Return HTTP Status 404 - Not Found
                const status = 404;
                res.status(status);
                res.send({ "status": status, "message": "No category found with id: " + req.params.category_id });
            }

        });
    });

    app.get('/api/categories/:category_id/threads', (req, res) => {
        const categoryId = parseInt(req.params.category_id);
        console.log("GET received on /api/categories/" + categoryId + "/threads");
        db.Thread.query().select(
            'threads.*',
            db.Thread.relatedQuery('posts').count().as('nrOfPosts'))
            .eager('creator').where({
                category_id: categoryId
            }).orderBy('last_activity', 'desc').then(threads => {
                if (threads.length > 0) {
                    // Return HTTP Status 200 - OK
                    const status = 200;
                    res.status(status);
                    res.send({ "status": status, data: threads });
                } else {
                    // Return HTTP Status 404 - Not Found
                    const status = 404;
                    res.status(status);
                    res.send({ "status": status, "message": "No category found with id: " + req.params.category_id });
                }
            })
    });

    app.post('/api/categories/:category_id/threads', (req, res) => {
        const categoryId = parseInt(req.params.category_id);
        console.log("POST received on /api/categories/" + categoryId + "/threads");
        
        if (req.session.isLoggedIn) {
            const userId = req.session.userId;
            db.Thread.query().insertWithRelatedAndFetch({
                category_id: categoryId,
                created_by: userId,
                name: req.body.name,
                posts: [{
                    content: req.body.content,
                    created_by: userId,
                    created_at: new Date()
                }]
            }).then(persistedData => {
                db.User.query().update({
                    last_activity: new Date(),
                }).where({ id: userId }).then(() => {
                    // Return HTTP Status 201 - Created
                    const status = 201;
                    res.status(status);
                    res.send({ "status": status, "message": "successfully posted thread", "data": persistedData });
                });
            });
        } else {
            // Return HTTP Status 401 - Unathorized
            const status = 401;
            res.status(status);
            res.send({ "status": status, "message": "you are currently not logged in" });
        }
    });

    app.get('/api/categories/:category_id/threads/:thread_id/posts', (req, res) => {
        const categoryId = parseInt(req.params.category_id);
        const threadId = parseInt(req.params.thread_id);
        console.log("GET received on /api/categories/" + categoryId + "/threads/" + threadId + "/posts");

        db.Thread.query().select().where({ id: req.params.thread_id }).eager('posts.creator').then(threads => {
            if (threads.length == 1) {
                // Return HTTP Status 200 - OK
                const status = 200;
                res.status(status);
                res.send({ "status": status, data: threads[0] });
            } else {
                // Return HTTP Status 404 - Not Found
                const status = 404;
                res.status(status);
                res.send({ "status": status, "message": "No thread found with id: " + req.params.thread_id });
            }
        })
    });

    app.post('/api/categories/:category_id/threads/:thread_id/posts', (req, res) => {
        const threadId = parseInt(req.params.thread_id);
        const categoryId = parseInt(req.params.category_id);
        console.log("POST received on /api/categories/" + categoryId + "/threads/" + threadId + "/posts");
        
        if (req.session.isLoggedIn) {
            const content = req.body.content;
            const userId = req.session.userId;
            db.Post.query().insert({ content: content, created_by: userId, thread_id: threadId, created_at: new Date() }).then(persistedData => {
                db.User.query().update({
                    last_activity: new Date()
                }).where({
                    id: userId
                }).then(() => {
                    db.User.query().select().where({ id: userId }).then(users => {
                        db.Thread.query().update({
                            last_activity: new Date()
                        }).where({ id: threadId }).then(() => {
                            persistedData.creator = users[0];
                            // Return HTTP Status 201 - Created
                            const status = 201;
                            res.status(status);
                            res.send({ "status": status, "message": "successfully posted reply", data: persistedData });
                        });
                    });
                });
            })
        } else {
            // Return HTTP Status 401 - Unathorized
            const status = 401;
            res.status(status);
            res.send({ "status": status, "message": "you are currently not logged in" });
        }
    });
    app.post('/api/categories/:category_id/threads/:thread_id/posts', (req, res) => {
        const threadId = parseInt(req.params.thread_id);
        console.log("POST received on /api/categories/" + categoryId + "/threads/" + threadId + "/posts");
        
        if (req.session.isLoggedIn) {
            const content = req.body.content;
            const userId = req.session.userId;
            db.Post.query().insert({ content: content, created_by: userId, thread_id: threadId, created_at: new Date() }).then(persistedData => {
                db.User.query().update({
                    last_activity: new Date()
                }).where({ id: userId }).then(() => {
                    db.Thread.query().update({
                        last_activity: new Date()
                    }).then(() => {
                        db.User.query().select().where({ id: userId }).then(users => {
                            persistedData.creator = users[0];
                            // Return HTTP Status 201 - Created
                            const status = 201;
                            res.status(status);
                            res.send({ "status": status, "message": "successfully posted reply", data: persistedData });
                        });
                    });
                });
            })
        } else {
            // Return HTTP Status 401 - Unathorized
            const status = 401;
            res.status(status);
            res.send({ "status": status, "message": "you are currently not logged in" });
        }
    });

    app.delete('/api/categories/:category_id/threads/:thread_id/posts/:post_id', (req, res) => {
        const postId = parseInt(req.params.post_id);    
        if (req.session.isLoggedIn) {
            db.Post.select().where({ id: postId }).then(posts => {
                let post = posts[0];
                if (post.created_by === req.session.userId) {
                    db.Post.deleteById(postId).then(() => {
                        // Return HTTP Status 204 - No Content: The server successfully processed the request, but is not returning any content
                        const status = 204;
                        res.status(status);
                        res.send({ "status": status, "message": "succesfully deleted the post" })
                    });
                } else {
                    // Return HTTP Status 403 - Forbidden
                    const status = 403;
                    res.status(status);
                    res.send({ "status": status, "message": "you do not have access to delete this post" })
                }
            });
        }
    });
}



