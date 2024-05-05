const {ObjectId} = require('mongodb');


const UsersQueryType = {
    NONAPPROVED: "get-non-approved-users",
};
const SearchQueryType = {
    TEXT: "Text",
    DATE: "Date"
}
const SearchReturnType = {
    THREAD: "Thread",
    USER: "User",
    MESSAGE: "Message",
};

function convertToObjectId(id) {
    if (id instanceof ObjectId) {
        return id;
    }
    return new ObjectId(id);
}

//Add a user to the database, used in sign in.
async function CreateUser(db, username, password, admin) {
    //Query username for unicity.
    const query = {username: username};
    const options = {projection: {_id: 1}};
    const data = await db.collection('Users').findOne(query, options);
    return new Promise((resolve, reject) => {
        if (data != null) {
            reject("User already exists");
        } else {
            const user = {
                username: username,
                password: password,
                register_date: Date.now(),
                is_admin: admin,
                approved: admin
            };
            const user_id = db.collection('Users').insertOne(user);
            resolve(user_id);
        }
    });
}

//Query the messsages of a thread of given id
async function GetThreadMessages(db, thread_id) {
    return new Promise((resolve, reject) => {
        const query = {thread_id: convertToObjectId(thread_id)};
        const options = {projection: {_id: 1, thread_id: 1, text: 1, user_id: 1, publish_date: 1, is_admin: 1}};
        const messages = db.collection('Messages').find(query, options).toArray();
        if (messages != null) {
            resolve(messages);
        } else {
            reject("No messages found");
        }
    });
}

//Query threads sorted y date, and return the first n threads of the query
async function GetFirstNThreadsByDate(db, n) {
    return new Promise((resolve, reject) => {
        const query = {};
        const options = {
            projection: {_id: 1, original_poster_id: 1, creation_date: 1, title: 1, is_admin: 1},
            sort: {creation_date: 1},
            limit: n
        };
        const result = db.collection('Threads').find(query, options).toArray();
        if (result != null) {
            resolve(result);
        } else {
            reject("No threads found");
        }
    });
}

//Add message by user of user_id to the thread of thread id in the database
async function CreateMessage(db, thread_id, user_id, text) {
    return new Promise((resolve, reject) => {
        const query = {_id: convertToObjectId(user_id)};
        const options = {projection: {_id: 0, username: 1}};
        const user = db.collection('Users').findOne(query, options);
        const message = {
            thread_id: convertToObjectId(thread_id),
            user_id: convertToObjectId(user_id),
            text: text,
            publish_date: Date.now()
        };
        db.collection('Messages').insertOne(message).then(() => {
            resolve();
        }).catch((err) => {
            reject(err);
        });
    });

}

async function GetUser(db, user_id) {
    return new Promise((resolve, reject) => {
        const query = {_id: convertToObjectId(user_id)};
        const options = {projection: {_id: 1, username: 1, register_date: 1, is_admin: 1, approved: 1}};
        const user = db.collection('Users').findOne(query, options);
        if (user != null) {
            resolve(user);
        } else {
            reject("User not found");
        }
    });
}

async function PromoteUser(db, user_id) {
    return new Promise((resolve, reject) => {
        const query = {_id: convertToObjectId(user_id)};
        const update = {$set: {is_admin: true}};
        db.collection('Users').updateOne(query, update).then(() => {
            resolve();
        }).catch((err) => {
            reject(err);
        });
    });
}

async function GetUserMessages(db, user_id) {
    return new Promise((resolve, reject) => {
        const query2 = {user_id: convertToObjectId(user_id)};
        const options2 = {projection: {_id: 1, thread_id: 1, user_id: 1, text: 1, publish_date: 1, is_admin: 1}};
        const messages = db.collection('Messages').find(query2, options2).toArray();
        if (messages != null) {
            resolve(messages);
        } else {
            reject("User not found");
        }
    });
}

async function ApproveUser(db, user_id) {
    return new Promise((resolve, reject) => {
        const query = {_id: convertToObjectId(user_id)};
        const update = {$set: {approved: true}};
        db.collection('Users').updateOne(query, update).then(() => {
            resolve();
        }).catch((err) => {
            reject(err);
        });
    });
}

async function CreateServerMessage(db, thread_id, user_id, title, is_admin) {
    return new Promise((resolve, reject) => {
        const query = {_id: user_id};
        const options = {projection: {_id: 0, username: 1}};
        const user = db.collection('Users').findOne(query, options);
        const text = `Thread ${title} created by ${user.username} (${new Date(Date.now()).toLocaleDateString()})`;
        const message = {thread_id: thread_id, user_id: 0, text: text, publish_date: Date.now(), is_admin: is_admin};
        db.collection('Messages').insertOne(message).then(() => {
            resolve();
        }).catch((err) => {
            reject(err);
        });
    });

}

async function CreateThread(db, original_poster_id, title, is_admin) {
    const query = {original_poster_id: original_poster_id, title: title, is_admin: is_admin}
    const options = {projection: {_id: 1}};
    const data = await db.collection('Threads').findOne(query, options);
    return new Promise((resolve, reject) => {
        if (data != null) {
            reject("Thread already exists");
        } else {
            const thread = {
                original_poster_id: original_poster_id,
                title: title,
                is_admin: is_admin,
                creation_date: Date.now()
            };
            const thread_id = db.collection('Threads').insertOne(thread);
            resolve(thread_id);
        }
    });
}

async function GetThreadByTitle(db, title) {
    const query = {title: title};
    const options = {projection: {_id: 0, original_poster_id: 1, creation_date: 1, title: 1, is_admin: 1}};
    const result = await db.collection('Threads').findOne(query, options);
    return await result.toArray();
}

async function GetNonApprovedUsers(db) {
    return new Promise((resolve, reject) => {
        const query = {approved: false};
        const options = {projection: {_id: 1, username: 1}};
        const users = db.collection('Users').find(query, options).toArray();
        if (users != null) {
            resolve(users);
        } else {
            reject("No non-approved users found");
        }
    });
}

async function GetUsersByQuery(db, queryType, count) {
    switch (queryType) {
        case UsersQueryType.NONAPPROVED:
            return await GetNonApprovedUsers(db);
    }
    console.log('Unknown query type');
    return null;
}

async function DeleteUser(db, user_id) {
    return new Promise((resolve, reject) => {
        const query = {_id: convertToObjectId(user_id)};
        db.collection('Users').deleteOne(query).then(() => {
                resolve();
            }
        ).catch(() => {
            reject()
        });
    });
}


async function Search(db, query) {
    return new Promise((resolve, reject) => {
        switch (query.returnType) {
            case SearchReturnType.THREAD:
                return SearchThreads(db, query.options);
            case SearchReturnType.USER:
                return SearchUsers(db, query.options);
            case SearchReturnType.MESSAGE:
                return SearchMessages(db, query.options);
            default:
                reject("Unknown search type");
        }
    });
}

async function SearchThreads(db, options) {
    return new Promise((resolve, reject) => {
        const queries = [];
        for (const option of options) {
            switch (option.by) {
                case SearchReturnType.THREAD:
                    switch (option.type) {
                        case SearchQueryType.TEXT:
                            queries.push({title: {$regex: option.value}});
                            break;
                        case SearchQueryType.DATE:
                            if (option.value.from != null && option.value.up_to != null) {
                                queries.push({creation_date: {$gte: option.value.from}});
                                queries.push({creation_date: {$lte: option.value.up_to}});
                                break;
                            }
                            break;
                        case SearchReturnType.USER:
                            switch (option.type) {
                                case SearchQueryType.TEXT:
                                    db.collection('Users').find({username: {$regex: option.value}}).then((users) => {
                                        users.map(user => queries.push({original_poster_id_id: user._id}));
                                    });
                                    break;
                                case SearchQueryType.DATE:
                                    db.collection('Users').find({
                                        register_date: {
                                            $gte: option.value.from,
                                            $lte: option.value.up_to
                                        }
                                    }).then((users) => {
                                        users.map(user => queries.push({original_poster_id_id: user._id}));
                                    });
                            }
                            break;
                        case SearchReturnType.MESSAGE:
                            switch (option.type) {
                                case SearchQueryType.TEXT:
                                    db.collection('Messages').find({text: {$regex: option.value}}).then((messages) => {
                                        messages.map(message => queries.push({_id: convertToObjectId(message.thread_id)}));
                                    });
                                    break;
                                case SearchQueryType.DATE:
                                    db.collection('Messages').find({
                                        publish_date: {
                                            $gte: option.value.from,
                                            $lte: option.value.up_to
                                        }
                                    }).then((messages) => {
                                        messages.map(message => queries.push({_id: convertToObjectId(message.thread_id)}));
                                    });

                            }
                            break;
                        default:
                            reject("Unknown search type");
                    }
            }

            const query = {$or: queries};
            const result = db.collection('Threads').find(query).toArray();
            if (result != null) {
                resolve(result);
            } else {
                reject("No threads found");
            }
        }
    });
}

async function SearchUsers(db, options) {
    return new Promise((resolve, reject) => {
        const queries = [];
        for (const option of options) {
            switch (option.by) {
                case SearchReturnType.THREAD:
                    switch (option.type) {
                        case SearchQueryType.TEXT:
                            db.collection('Threads').find({title: {$regex: option.value}}).then((threads) => {
                                threads.map(thread => queries.push({_id: convertToObjectId(thread.original_poster_id)}));
                            });
                            break;
                        case SearchQueryType.DATE:
                            db.collection('Threads').find({
                                creation_date: {
                                    $gte: option.value.from,
                                    $lte: option.value.up_to
                                }
                            }).then((threads) => {
                                threads.map(thread => queries.push({_id: convertToObjectId(thread.original_poster_id)}));
                            });
                            break;
                        default:
                            reject("Unknown search type");
                    }
                    break;
                case SearchReturnType.USER:
                    switch (option.type) {
                        case SearchQueryType.TEXT:
                            queries.push({username: {$regex: option.value}});
                            break;
                        case SearchQueryType.DATE:
                            queries.push({
                                register_date: {
                                    $gte: option.value.from,
                                    $lte: option.value.up_to
                                }
                            });
                            break;
                        default:
                            reject("Unknown search type");
                    }
                    break;
                case SearchReturnType.MESSAGE:
                    switch (option.type) {
                        case SearchQueryType.TEXT:
                            db.collection('Messages').find({text: {$regex: option.value}}).then((messages) => {
                                messages.map(message => queries.push({_id: message.user_id}));
                            });
                            break;
                        case SearchQueryType.DATE:
                            db.collection('Messages').find({
                                publish_date: {
                                    $gte: option.value.from,
                                    $lte: option.value.up_to
                                }
                            }).then((messages) => {
                                messages.map(message => queries.push({_id: message.user_id}));
                            });
                            break;
                        default:
                            reject("Unknown search type");
                    }
                    break;
                default:
                    reject("Unknown search type");
            }
        }
        const query = {$or: queries};
        const result = db.collection('Users').find(query).toArray();
        if (result != null) {
            resolve(result);
        } else {
            reject("No users found");
        }
    });
}

async function SearchMessages(db, options) {
    return new Promise((resolve, reject) => {
        const queries = [];
        for (const option of options) {
            switch (option.by) {
                case SearchReturnType.THREAD:
                    switch (option.type) {
                        case SearchQueryType.TEXT:
                            db.collection('Threads').find({title: {$regex: option.value}}).then((threads) => {
                                threads.map(thread => queries.push({thread_id: convertToObjectId(thread._id)}));
                            });
                            break;
                        case SearchQueryType.DATE:
                            db.collection('Threads').find({
                                creation_date: {
                                    $gte: option.value.from,
                                    $lte: option.value.up_to
                                }
                            }).then((threads) => {
                                threads.map(thread => queries.push({thread_id : convertToObjectId(thread._id)}));
                            });
                            break;
                        default:
                            reject("Unknown search type");
                    }
                    break;
                case SearchReturnType.USER:
                    switch (option.type) {
                        case SearchQueryType.TEXT:
                            db.collection('Users').find({username: {$regex: option.value}}).then((users) => {
                                users.map(user => queries.push({user_id: convertToObjectId(user._id)}))});
                            break;
                        case SearchQueryType.DATE:
                            db.collection('Users').find({
                                register_date: {
                                    $gte: option.value.from,
                                    $lte: option.value.up_to
                                }
                            }).then((users) => {
                                users.map(user => queries.push({user_id: convertToObjectId(user._id)}));
                            });
                            break;
                        default:
                            reject("Unknown search type");
                    }
                    break;
                case SearchReturnType.MESSAGE:
                    switch (option.type) {
                        case SearchQueryType.TEXT:
                            queries.push({text: {$regex: option.value}});
                            break;
                        case SearchQueryType.DATE:
                            queries.push({
                                publish_date: {
                                    $gte: option.value.from,
                                    $lte: option.value.up_to
                                }
                            });
                            break;
                        default:
                            reject("Unknown search type");
                    }
                    break;
                default:
                    reject("Unknown search type");
            }
        }
        const query = {$or: queries};
        const result = db.collection('Messages').find(query).toArray();
        if (result != null) {
            resolve(result);
        } else {
            reject("No users found");
        }
    });
}
async function GetThreadByQuery(db, queryType, count) {
    switch (queryType) {
        case "By-most-recent":
            return await GetFirstNThreadsByDate(db, count);
    }
    console.log('Unknown query type');
    return null;
}

module.exports = {
    Search,
    DeleteUser,
    PromoteUser,
    GetUsersByQuery,
    ApproveUser,
    CreateUser,
    GetUserMessages,
    GetUser,
    GetThreadMessages,
    CreateMessage,
    GetThreadByQuery,
    CreateThread,
    CreateServerMessage
};