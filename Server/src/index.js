const express = require('express')
const app = express();
const session = require('express-session')
const cors = require('cors');
const { MongoClient } = require('mongodb');
const MongoDBStore = require('connect-mongodb-session')(session);
const api = require('./api.js');
app.use(express.json())

/**
 * Middleware function to check if a user is connected.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
function isConnected(req, res, next) {
    if (!req.session.user) {
        res.status(401).json({ message: "User not connected" });
        return;
    }
    next();
}
/**
 * Middleware function to check if a user is an admin.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
function isAdmin(req, res, next) {
    if (!req.session.user.is_admin) {
        res.status(401).json({ message: "User not admin" });
        return;
    }
    next();
}

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
}));

const dburl = "mongodb+srv://victorlocherer:blQqG6A9ZpIX4p3Q@clusterprojet.etclz03.mongodb.net/"
const client = new MongoClient(dburl);

var store = new MongoDBStore({
    uri: dburl,
    databaseName: 'DatabaseProjet',
    collection: 'Sessions'
});

store.on('error', function (error) {
    console.log(error);
});

client
    .connect()
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });
app.use(session({
    secret: 'secret',
    secure: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24// 24 heures
        },
    store: store,
    saveUninitialized: true
}))
app.use((req, res, next) => {
    req.db = client.db('DatabaseProjet'); // Attach the database to the request
    next();
});

/**
 * Create a new thread.
 */
app.post('/threads', isConnected, async (req, res) => {
    api.CreateThread(req.db, req.body.original_poster_id, req.body.title, req.session.user.is_admin && req.body.is_admin).then((thread_id) => {
        api.CreateServerMessage(req.db, thread_id.insertedId, req.body.original_poster_id, req.body.title, req.session.user.is_admin && req.body.is_admin)
        res.status(200).json({ thread_id: thread_id.insertedId });
    })
        .catch(reason => {
            res.status(400).json({ message: reason.message });
        });
});

/**
 * Get messages of a thread.
 */
app.get('/threads/:thread_id', isConnected, async (req, res) => {
    api.GetThreadMessages(req.db, req.params.thread_id).then((messages) => {
        res.status(200).json({ messages: messages });
    }).catch(reason => {
        res.status(400).json({ message: reason.message });
    })
});

/**
 * Create a new message in a thread.
 */
app.post('/threads/:thread_id', isConnected, async (req, res) => {
    api.CreateMessage(req.db, req.params.thread_id, req.body.user_id, req.body.text).then(() => {
        res.status(200).json({ message: "Message created" });
    }).catch(reason => {
        res.status(400).json({ message: reason.message });
    });
});

/**
 * Get user information.
 */
app.get('/users/:user_id', isConnected, async (req, res) => {
    if (req.params.user_id === "0") {
        res.status(200).json({ user: { username: "Server", logo: "" }, messages: [] });
        return;
    }
    api.GetUser(req.db, req.params.user_id).then((user) => {
        api.GetUserMessages(req.db, req.params.user_id, req.session.user.is_admin).then((messages) => {
            res.status(200).json({ user: user, messages: messages });
        }).catch(reason => {
            res.status(400).json({ message: reason.message });
        })
    }).catch(reason => {
        res.status(400).json({ message: reason.message });
    })
});

/**
 * Update user information.
 */
app.patch('/users/:user_id', isConnected, async (req, res) => {
    api.PatchUser(req.db, req.session.user, req.params.user_id, req.body.field, req.body.value).then(() => {
        res.status(200).json({ message: "User patched" });
    }).catch(reason => {
        res.status(400).json({ message: reason.message });
    });
});

/**
 * Get threads based on query.
 */
app.get('/threads', isConnected, async (req, res) => {
    api.GetThreadByQuery(req.db, req.query.queryType, req.query.count, req.session.user.is_admin).then((threads) => {
        res.status(200).json(threads);
    }).catch(reason => {
        res.status(400).json({ message: reason.message });
    })
});

/**
 * Delete a user.
 */
app.delete('/users/:user_id', isConnected, isAdmin, async (req, res) => {
    api.DeleteUser(req.db, req.params.user_id).then(() => {
        res.status(200).json({ message: "User deleted" });
    }).catch(reason => {
        res.status(400).json({ message: reason.message });
    });
});

/**
 * Delete a thread.
 */
app.delete('/threads/:thread_id', isConnected, async (req, res) => {
    api.DeleteThread(req.db, req.params.thread_id).then(() => {
        res.status(200).json({ message: "Thread deleted" });
    }).catch(reason => {
        res.status(400).json({ message: reason.message });
    });
});

/**
 * Delete a message.
 */
app.delete('/messages/:message_id', isConnected, async (req, res) => {
    api.DeleteMessage(req.db, req.params.message_id).then(() => {
        res.status(200).json({ message: "Message deleted" });
    }).catch(reason => {
        res.status(400).json({ message: reason.message });
    });
});

/**
 * User login authentication.
 */
app.post('/authentication/login', async (req, res) => {
    const collection = req.db.collection('Users');
    const query = { username: req.body.login, password: req.body.password };
    const options = { projection: { _id: 1, username: 1, password: 1, register_date: 1, is_admin: 1, approved: 1 } };
    const result = await collection.findOne(query, options);
    if (result != null) {
        if (result.approved === false) {
            res.status(401).json({ message: "User account waiting admin for approval" });
            return;
        }

        req.session.regenerate(function (err) {
            if (err) next(err)

            req.session.user = result;

            req.session.save(function (err) {
                if (err) return next(err)
                res.status(200).json(result);
            })
        })
    } else {
        const queryName = { username: req.body.login };
        const resultName = await collection.findOne(queryName, options);
        if (resultName != null) {
            res.status(401).json({ message: "Wrong password" });
        } else {
            res.status(401).json({ message: "User not found" });
        }
    }
});

/**
 * User logout.
 */
app.get('/authentication/logout', isConnected, async (req, res) => {
    req.session.destroy();
    res.status(200).json({ message: "Logged out" });
});

/**
 * Search for threads or users.
 */
app.get('/search', isConnected, async (req, res) => {
    api.Search(req.db, req.query, req.session.user.is_admin).then((results) => {
        res.status(200).json(results);
    }).catch(reason => {
        res.status(400).json({ message: reason.message });
    })
});

/**
 * Get users based on query.
 */
app.get('/users', isConnected, async (req, res) => {
    api.GetUsersByQuery(req.db, req.query.queryType).then((users) => {
        res.status(200).json(users);
    }).catch(reason => {
        res.status(400).json({ message: reason.message });
    })
});

/**
 * Create a new user.
 */
app.post('/users', async (req, res) => {
    api.CreateUser(req.db, req.body.login, req.body.password, req.body.admin).then((user_id) => {
        console.log("User Created")
        res.status(200).json({ user_id: user_id.insertedId });
    })
        .catch(reason => {
            res.status(400).json({ message: reason.message });
        });
});

// start express server on port 5000
app.listen(5000, () => {
    console.log("server started on port 5000");
});

