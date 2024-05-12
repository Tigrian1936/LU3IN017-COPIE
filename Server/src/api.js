const { ObjectId } = require('mongodb');

/**
 * Enum representing the types of users query.
 * @enum {string}
 */
const UsersQueryType = {
    NONAPPROVED: "get-non-approved-users",
};

/**
 * Enum representing the types of search query.
 * @enum {string}
 */
const SearchQueryType = {
    TEXT: "Text",
    DATE: "Date"
}

/**
 * Enum representing the types of search return.
 * @enum {string}
 */
const SearchReturnType = {
    THREAD: "Threads",
    USER: "Users",
    MESSAGE: "Messages",
};

/**
 * Converts a string or ObjectId to ObjectId.
 * @param {string|ObjectId} id - The id to convert.
 * @returns {ObjectId} The converted ObjectId.
 */
function convertToObjectId(id) {
    if (id instanceof ObjectId) {
        return id;
    }
    return new ObjectId(id);
}

/**
 * Add a user to the database, used in sign in.
 * @param {Object} db - The database object.
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * @param {boolean} admin - The admin status of the user.
 * @returns {Promise<ObjectId>} The id of the created user.
 */
async function CreateUser(db, username, password, admin) {
    //Query username for unicity.
    const query = { username: username };
    const options = { projection: { _id: 1 } };
    const data = await db.collection('Users').findOne(query, options);
    return new Promise((resolve, reject) => {
        if (data != null) {
            reject("User already exists");
        } else {
            const user = {
                username: username,
                password: password,
                register_date: new Date(),
                is_admin: admin,
                approved: admin
            };
            const user_id = db.collection('Users').insertOne(user);
            resolve(user_id);
        }
    });
}

/**
 * Query the messages of a thread of given id.
 * @param {Object} db - The database object.
 * @param {string} thread_id - The id of the thread.
 * @returns {Promise<Array<Object>>} The messages of the thread.
 */
async function GetThreadMessages(db, thread_id) {
    return new Promise((resolve, reject) => {
        const query = { thread_id: convertToObjectId(thread_id) };
        const options = { projection: { _id: 1, thread_id: 1, text: 1, user_id: 1, publish_date: 1, is_admin: 1 } };
        const messages = db.collection('Messages').find(query, options).toArray();
        if (messages != null) {
            resolve(messages);
        } else {
            reject("No messages found");
        }
    });
}

/**
 * Query threads sorted by date, and return the first n threads of the query.
 * @param {Object} db - The database object.
 * @param {number} n - The number of threads to return.
 * @param {boolean} is_admin - The admin status of the user.
 * @returns {Promise<Array<Object>>} The first n threads sorted by date.
 */
async function GetFirstNThreadsByDate(db, n, is_admin) {
    return new Promise((resolve, reject) => {
        if (is_admin) {
            const query = {};
            const options = {
                projection: { _id: 1, original_poster_id: 1, creation_date: 1, title: 1, is_admin: 1 },
                sort: { creation_date: 1 },
                limit: n
            };
            const result = db.collection('Threads').find(query, options).toArray();
            if (result != null) {
                resolve(result);
            } else {
                reject("No threads found");
            }
        }
        else {
            const query = { is_admin: false };
            const options = {
                projection: { _id: 1, original_poster_id: 1, creation_date: 1, title: 1, is_admin: 1 },
                sort: { creation_date: 1 },
                limit: n
            };
            const result = db.collection('Threads').find(query, options).toArray();
            if (result != null) {
                resolve(result);
            } else {
                reject("No threads found");
            }
        }
    });
}

/**
 * Patch a user's field in the database.
 * @param {Object} db - The database object.
 * @param {Object} connectedUser - The connected user object.
 * @param {string} user_id - The id of the user to patch.
 * @param {string} field - The field to patch.
 * @param {any} value - The new value of the field.
 * @returns {Promise<void>} A promise that resolves when the user's field is patched.
 */
async function PatchUser(db, connectedUser, user_id, field, value) {
    var reason = "";
    switch (field) {
        case "approved":
        case "is_admin":
            if (connectedUser.is_admin) {
                return PatchUserField(db, user_id, field, value);
            }
            reason = "User not admin";
            break;
        case "username":
        case "password":
            if (convertToObjectId(connectedUser.id) === convertToObjectId(user_id)) {
                return PatchUserField(db, user_id, field, value);
            }
            reason = "Cannot change another user's username or password";
            break;
        case "register_date":
            reason = "Cannot change register date";
            break;
        default:
            reason = "Invalid field";
            break;
    }

    return new Promise((resolve, reject) => {
        reject(reason);
    });
}

/**
 * Add a message to the thread in the database.
 * @param {Object} db - The database object.
 * @param {string} thread_id - The id of the thread.
 * @param {string} user_id - The id of the user.
 * @param {string} text - The text of the message.
 * @returns {Promise<void>} A promise that resolves when the message is created.
 */
async function CreateMessage(db, thread_id, user_id, text) {
    return new Promise((resolve, reject) => {
        const threadQuery = { _id: convertToObjectId(thread_id) };
        const threadOptions = { projection: { _id: 0, original_poster_id: 1, is_admin: 1 } };
        db.collection('Threads').findOne(threadQuery, threadOptions).then((thread) => {
            const query = { _id: convertToObjectId(user_id) };
            const options = { projection: { _id: 0, username: 1 } };
            db.collection('Users').findOne(query, options).then((user) => {
                const message = {
                    thread_id: convertToObjectId(thread_id),
                    user_id: convertToObjectId(user_id),
                    text: text,
                    publish_date: new Date(),
                    is_admin: thread.is_admin
                };
                db.collection('Messages').insertOne(message).then(() => {
                    resolve();
                }).catch((err) => {
                    reject(err);
                });
            }).catch((err) => {
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        })

    });

}

/**
 * Get a user from the database.
 * @param {Object} db - The database object.
 * @param {string} user_id - The id of the user.
 * @returns {Promise<Object>} The user object.
 */
async function GetUser(db, user_id) {
    return new Promise((resolve, reject) => {
        const query = { _id: convertToObjectId(user_id) };
        const options = { projection: { _id: 1, username: 1, register_date: 1, is_admin: 1, approved: 1 } };
        const user = db.collection('Users').findOne(query, options);
        if (user != null) {
            resolve(user);
        } else {
            reject("User not found");
        }
    });
}

/**
 * Patch a user's field in the database.
 * @param {Object} db - The database object.
 * @param {string} user_id - The id of the user.
 * @param {string} field - The field to patch.
 * @param {any} value - The new value of the field.
 * @returns {Promise<void>} A promise that resolves when the user's field is patched.
 */
async function PatchUserField(db, user_id, field, value) {
    return new Promise((resolve, reject) => {
        const query = { _id: convertToObjectId(user_id) };
        const update = { $set: { [field]: value } };
        db.collection('Users').updateOne(query, update).then(() => {
            resolve();
        }).catch((err) => {
            reject(err);
        });
    });
}

/**
 * Get messages of a user from the database.
 * @param {Object} db - The database object.
 * @param {string} user_id - The id of the user.
 * @param {boolean} is_admin - The admin status of the user.
 * @returns {Promise<Array<Object>>} The messages of the user.
 */
async function GetUserMessages(db, user_id, is_admin) {
    return new Promise((resolve, reject) => {
        if (is_admin) {
            const query2 = { user_id: convertToObjectId(user_id) };
            const options2 = { projection: { _id: 1, thread_id: 1, user_id: 1, text: 1, publish_date: 1, is_admin: 1 } };
            const messages = db.collection('Messages').find(query2, options2).toArray();
            if (messages != null) {
                resolve(messages);
            } else {
                reject("User not found");
            }
        }
        else {
            const query2 = { user_id: convertToObjectId(user_id), is_admin: false };
            const options2 = { projection: { _id: 1, thread_id: 1, user_id: 1, text: 1, publish_date: 1, is_admin: 1 } };
            const messages = db.collection('Messages').find(query2, options2).toArray();
            if (messages != null) {
                resolve(messages);
            } else {
                reject("User not found");
            }
        }
    });
}

/**
 * Create a server message in the database.
 * @param {Object} db - The database object.
 * @param {string} thread_id - The id of the thread.
 * @param {string} user_id - The id of the user.
 * @param {string} title - The title of the thread.
 * @param {boolean} is_admin - The admin status of the user.
 * @returns {Promise<void>} A promise that resolves when the server message is created.
 */
async function CreateServerMessage(db, thread_id, user_id, title, is_admin) {
    return new Promise((resolve, reject) => {
        const query = { _id: convertToObjectId(user_id) };
        const options = { projection: { _id: 1, username: 1 } };
        db.collection('Users').findOne(query, options).then((user) => {
            const text = `Thread ${title} created by ${user.username} (${new Date().toLocaleDateString()})`;
            const message = { thread_id: thread_id, user_id: 0, text: text, publish_date: new Date(), is_admin: is_admin };
            db.collection('Messages').insertOne(message).then(() => {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        });
    });

}

/**
 * Create a thread in the database.
 * @param {Object} db - The database object.
 * @param {string} original_poster_id - The id of the original poster.
 * @param {string} title - The title of the thread.
 * @param {boolean} is_admin - The admin status of the user.
 * @returns {Promise<ObjectId>} The id of the created thread.
 */
async function CreateThread(db, original_poster_id, title, is_admin) {
    const query = { original_poster_id: original_poster_id, title: title, is_admin: is_admin }
    const options = { projection: { _id: 1 } };
    const data = await db.collection('Threads').findOne(query, options);
    return new Promise((resolve, reject) => {
        if (data != null) {
            reject("Thread already exists");
        } else {
            const thread = {
                original_poster_id: original_poster_id,
                title: title,
                is_admin: is_admin,
                creation_date: new Date()
            };
            const thread_id = db.collection('Threads').insertOne(thread);
            resolve(thread_id);
        }
    });
}

/**
 * Get non-approved users from the database.
 * @param {Object} db - The database object.
 * @returns {Promise<Array<Object>>} The non-approved users.
 */
async function GetNonApprovedUsers(db) {
    return new Promise((resolve, reject) => {
        const query = { approved: false };
        const options = { projection: { _id: 1, username: 1 } };
        const users = db.collection('Users').find(query, options).toArray();
        if (users != null) {
            resolve(users);
        } else {
            reject("No non-approved users found");
        }
    });
}

/**
 * Get users by query type from the database.
 * @param {Object} db - The database object.
 * @param {string} queryType - The type of query.
 * @param {number} count - The number of users to return.
 * @returns {Promise<Array<Object>>} The users based on the query type.
 */
async function GetUsersByQuery(db, queryType, count) {
    switch (queryType) {
        case UsersQueryType.NONAPPROVED:
            return await GetNonApprovedUsers(db);
    }
    console.log('Unknown query type');
    return null;
}

/**
 * Delete a user from the database.
 * @param {Object} db - The database object.
 * @param {string} user_id - The id of the user to delete.
 * @returns {Promise<void>} A promise that resolves when the user is deleted.
 */
async function DeleteUser(db, user_id) {
    return new Promise((resolve, reject) => {
        const query = { _id: convertToObjectId(user_id) };
        db.collection('Users').deleteOne(query).then(() => {
            resolve();
        }
        ).catch(() => {
            reject()
        });
    });
}

/**
 * Delete a message from the database.
 * @param {Object} db - The database object.
 * @param {string} message_id - The id of the message to delete.
 * @returns {Promise<void>} A promise that resolves when the message is deleted.
 */
async function DeleteMessage(db, message_id) {
    return new Promise((resolve, reject) => {
        const query = { _id: convertToObjectId(message_id) };
        db.collection('Messages').deleteOne(query).then(() => {
            console.log("Message Deleted")
            resolve();
        }
        ).catch(() => {
            reject()
        });
    });
}


/**
 * Deletes a thread and its associated messages from the database.
 * @param {Object} db - The database object.
 * @param {string} thread_id - The ID of the thread to delete.
 * @returns {Promise<void>} - A promise that resolves when the thread and messages are deleted successfully.
 */
async function DeleteThread(db, thread_id) {
    return new Promise((resolve, reject) => {
        const queryMessages = { thread_id: convertToObjectId(thread_id) };
        db.collection('Messages').deleteMany(queryMessages).then(() => {
            const query = { _id: convertToObjectId(thread_id) };
            db.collection('Threads').deleteOne(query).then(() => {
                resolve();
            }).catch(() => {
                reject();
            });
        }).catch(() => {
            reject();
        });
    });
}

//ça devrait être possible de faire une méthode qui regroupe les 3 méthodes de recherche, ça simplifirait que 
//d'avoir 3 méthodes similaires (en passant le type d'une option dans le collection de db, on peut rendre les recherches secondaires génériques)
//Mais bon, j'ai fait comme ça, ça marche aussi, et je me casse pas la tête pour ça (même si c'est plus lourd à maintenir)

/**
 * Performs a search operation based on the provided query.
 * @param {Object} db - The database object.
 * @param {Object} query - The search query.
 * @param {boolean} is_admin - Indicates whether the user is an admin.
 * @returns {Promise<Object>} - A promise that resolves to the search result.
 */
async function Search(db, query, is_admin) {
    switch (query.returnType) {
        case SearchReturnType.THREAD:
            return SearchThreads(db, query.options, is_admin);
        case SearchReturnType.USER:
            return SearchUsers(db, query.options);
        case SearchReturnType.MESSAGE:
            return SearchMessages(db, query.options, is_admin);
        default:
            return { message: "Unknown search type" };
    }
}


/**
 * Searches for threads in the database based on the provided options.
 * @param {Object} db - The database object.
 * @param {Array} options - An array of search options.
 * @param {boolean} is_admin - Indicates whether the user is an admin or not.
 * @returns {Promise<Array>} - A promise that resolves to an array of matching threads.
 * @throws {string} - Throws an error if no queries are found or if nothing matches the query.
 */
async function SearchThreads(db, options, is_admin) {
    return new Promise((resolve, reject) => {
        const mainQueries = [];
        const userQueries = [];
        const messageQueries = [];

        for (const option of options) {
            switch (option.by) {
                case SearchReturnType.THREAD:
                    switch (option.type) {
                        case SearchQueryType.TEXT:
                            mainQueries.push({ "title": { $regex: option.value } });
                            break;
                        case SearchQueryType.DATE:
                            if (option.value.from != null && option.value.up_to != null) {
                                mainQueries.push({ creation_date: { $gte: new Date(option.value.from) } });
                                mainQueries.push({ creation_date: { $lte: new Date(option.value.up_to) } });
                            }
                            break;
                        default:
                            reject("Unknown search type");
                            return;
                    }
                    break;
                case SearchReturnType.USER:
                    switch (option.type) {
                        case SearchQueryType.TEXT:
                            userQueries.push({ "username": { $regex: option.value } });
                            break;
                        case SearchQueryType.DATE:
                            userQueries.push({
                                register_date: {
                                    $gte: new Date(option.value.from),
                                    $lte: new Date(option.value.up_to)
                                }
                            });
                            break;
                        default:
                            reject("Unknown search type");
                            return;
                    }
                    break;
                case SearchReturnType.MESSAGE:
                    switch (option.type) {
                        case SearchQueryType.TEXT:
                            messageQueries.push({ "text": { $regex: option.value } });
                            break;
                        case SearchQueryType.DATE:
                            messageQueries.push({
                                publish_date: {
                                    $gte: new Date(option.value.from),
                                    $lte: new Date(option.value.up_to)
                                }
                            });
                            break;
                        default:
                            reject("Unknown search type");
                            return;
                    }
                    break;
                default:
                    reject("Unknown search type");
                    return;
            }
        }

        if (!is_admin) {
            mainQueries.push({ is_admin: false });
        }

        if (userQueries.length > 0) {
            db.collection('Users').find({ $and: userQueries }).toArray().then((users) => {
                if (users.length > 0) {
                    var temp1 = { $or: [] }
                    users.forEach(user => temp1.$or.push({ original_poster_id: convertToObjectId(user._id) }));
                    mainQueries.push(temp1)
                }
                if (messageQueries.length > 0) {
                    db.collection('Messages').find({ $and: messageQueries }).toArray().then((messages) => {
                        if (messages.length > 0) {
                            var temp2 = { $or: [] }
                            messages.forEach(message => temp2.$or.push({ _id: convertToObjectId(message.thread_id) }));
                            mainQueries.push(temp2)
                        }
                        if (mainQueries.length === 0) {
                            reject("No queries found");
                            return
                        }
                        const query = { $and: mainQueries };
                        const result = db.collection('Threads').find(query).toArray();
                        if (result != null) {
                            resolve(result);
                        } else {
                            reject("Nothing matched the query");
                        }
                    }).catch((err) => {
                        reject(err);
                    });
                } else {
                    if (mainQueries.length === 0) {
                        reject("No queries found");
                        return
                    }
                    const query = { $and: mainQueries };
                    const result = db.collection('Threads').find(query).toArray();
                    if (result != null) {
                        resolve(result);
                    } else {
                        reject("Nothing matched the query");
                    }
                }
            }).catch((err) => {
                reject(err);
            });
        } else {
            if (messageQueries.length > 0) {
                db.collection('Messages').find({ $and: messageQueries }).toArray().then((messages) => {
                    if (messages.length > 0) {
                        var temp3 = { $or: [] }
                        messages.forEach(message => temp3.$or.push({ _id: convertToObjectId(message.thread_id) }));
                        mainQueries.push(temp3)
                    }
                    if (mainQueries.length === 0) {
                        reject("No queries found");
                        return
                    }
                    const query = { $and: mainQueries };
                    const result = db.collection('Threads').find(query).toArray();

                    if (result != null) {
                        resolve(result);
                    } else {
                        reject("Nothing matched the query");
                    }
                }).catch((err) => {
                    reject(err);
                });
            } else {
                if (mainQueries.length === 0) {
                    reject("No queries found");
                    return
                }
                const query = { $and: mainQueries };
                const result = db.collection('Threads').find(query).toArray();
                if (result != null) {
                    resolve(result);
                } else {
                    reject("Nothing matched the query");
                }
            }
        }
    });
}

/**
 * Searches for users in the database based on the provided options.
 * @param {Object} db - The database object.
 * @param {Array} options - An array of search options.
 * @returns {Promise<Array>} - A promise that resolves to an array of matching users.
 * @throws {string} - Throws an error if no queries are found or if nothing matches the query.
 */
async function SearchUsers(db, options) {
    return new Promise((resolve, reject) => {
        const mainQueries = [];
        const threadQueries = [];
        const messageQueries = [];
        for (const option of options) {
            switch (option.by) {
                case SearchReturnType.THREAD:
                    switch (option.type) {
                        case SearchQueryType.TEXT:
                            threadQueries.push({ "title": { $regex: option.value } });
                            break;
                        case SearchQueryType.DATE:
                            threadQueries.push({
                                creation_date: {
                                    $gte: new Date(option.value.from),
                                    $lte: new Date(option.value.up_to)
                                }
                            });
                            break;
                        default:
                            reject("Unknown search type");
                            return;
                    }
                    break;
                case SearchReturnType.USER:
                    switch (option.type) {
                        case SearchQueryType.TEXT:
                            mainQueries.push({ "username": { $regex: option.value } });
                            break;
                        case SearchQueryType.DATE:
                            mainQueries.push({
                                register_date: {
                                    $gte: new Date(option.value.from),
                                    $lte: new Date(option.value.up_to)
                                }
                            });
                            break;
                        default:
                            reject("Unknown search type");
                            return;
                    }
                    break;
                case SearchReturnType.MESSAGE:
                    switch (option.type) {
                        case SearchQueryType.TEXT:
                            messageQueries.push({ "text": { $regex: option.value } });
                            break;
                        case SearchQueryType.DATE:
                            messageQueries.push({
                                publish_date: {
                                    $gte: new Date(option.value.from),
                                    $lte: new Date(option.value.up_to)
                                }
                            });
                            break;
                        default:
                            reject("Unknown search type");
                            return;
                    }
                    break;
                default:
                    reject("Unknown search type");
                    return;
            }
        }


        if (threadQueries.length > 0) {
            db.collection('Threads').find({ $and: threadQueries }).toArray().then((threads) => {
                if (threads.length > 0) {
                    var temp1 = { $or: [] }
                    threads.forEach(thread => temp1.$or.push({ _id: convertToObjectId(thread.original_poster_id) }));
                    mainQueries.push(temp1);
                }
                if (messageQueries.length > 0) {
                    db.collection('Messages').find({ $and: messageQueries }).toArray().then((messages) => {
                        if (messages.length > 0) {
                            var temp2 = { $or: [] }
                            messages.forEach(message => temp2.$or.push({ _id: convertToObjectId(message.user_id) }));
                            mainQueries.push(temp2)
                        }
                        if (mainQueries.length === 0) {
                            reject("No queries found");
                            return
                        }
                        const query = { $and: mainQueries };
                        const result = db.collection('Users').find(query).toArray();
                        if (result != null) {
                            resolve(result);
                        } else {
                            reject("Nothing matched the query");
                        }
                    }).catch((err) => {
                        reject(err);
                    });
                } else {
                    if (mainQueries.length === 0) {
                        reject("No queries found");
                        return
                    }
                    const query = { $and: mainQueries };
                    const result = db.collection('Users').find(query).toArray();
                    if (result != null) {
                        resolve(result);
                    } else {
                        reject("Nothing matched the query");
                    }
                }
            }).catch((err) => {
                reject(err);
            });
        } else {
            if (messageQueries.length > 0) {
                db.collection('Messages').find({ $and: messageQueries }).toArray().then((messages) => {
                    if (messages.length > 0) {
                        var temp3 = { $or: [] }
                        messages.forEach(message => temp3.$or.push({ _id: convertToObjectId(message.user_id) }));
                        mainQueries.push(temp3)
                    }
                    if (mainQueries.length === 0) {
                        reject("No queries found");
                        return
                    }
                    const query = { $and: mainQueries };
                    const result = db.collection('Users').find(query).toArray();
                    if (result != null) {
                        resolve(result);
                    } else {
                        reject("Nothing matched the query");
                    }
                }).catch((err) => {
                    reject(err);
                });
            } else {
                if (mainQueries.length === 0) {
                    reject("No queries found");
                    return
                }
                const query = { $and: mainQueries };
                const result = db.collection('Users').find(query).toArray();
                if (result != null) {
                    resolve(result);
                } else {
                    reject("Nothing matched the query");
                }
            }
        }
    });
}

/**
 * Searches for messages in the database based on the provided options.
 * @param {Object} db - The database object.
 * @param {Array} options - An array of search options.
 * @param {boolean} is_admin - Indicates whether the user is an admin.
 * @returns {Promise<Array>} - A promise that resolves to an array of search results.
 * @throws {string} - Throws an error if an unknown search type is encountered or if no queries are found.
 */
async function SearchMessages(db, options, is_admin) {
    return new Promise((resolve, reject) => {
        const mainQueries = [];
        const threadQueries = [];
        const userQueries = [];
        for (const option of options) {
            switch (option.by) {
                case SearchReturnType.THREAD:
                    switch (option.type) {
                        case SearchQueryType.TEXT:
                            threadQueries.push({ "title": { $regex: option.value } });
                            break;
                        case SearchQueryType.DATE:
                            threadQueries.push({
                                creation_date: {
                                    $gte: new Date(option.value.from),
                                    $lte: new Date(option.value.up_to)
                                }
                            });
                            break;
                        default:
                            reject("Unknown search type");
                            return;
                    }
                    break;
                case SearchReturnType.USER:
                    switch (option.type) {
                        case SearchQueryType.TEXT:
                            userQueries.push({ "username": { $regex: option.value } });
                            break;
                        case SearchQueryType.DATE:
                            userQueries.push({
                                register_date: {
                                    $gte: new Date(option.value.from),
                                    $lte: new Date(option.value.up_to)
                                }
                            });
                            break;
                        default:
                            reject("Unknown search type");
                            return;
                    }
                    break;
                case SearchReturnType.MESSAGE:
                    switch (option.type) {
                        case SearchQueryType.TEXT:
                            mainQueries.push({ "text": { $regex: option.value } });
                            break;
                        case SearchQueryType.DATE:
                            mainQueries.push({
                                publish_date: {
                                    $gte: new Date(option.value.from),
                                    $lte: new Date(option.value.up_to)
                                }
                            });
                            break;
                        default:
                            reject("Unknown search type");
                            return;
                    }
                    break;
                default:
                    reject("Unknown search type");
                    return;
            }
        }

        if (!is_admin) {
            mainQueries.push({ is_admin: false });
        }

        if (threadQueries.length > 0) {
            db.collection('Threads').find({ $and: threadQueries }).toArray().then((threads) => {
                if (threads.length > 0) {
                    var temp1 = { $or: [] }
                    threads.forEach(thread => temp1.$or.push({ thread_id: convertToObjectId(thread._id) }));
                    mainQueries.push(temp1);
                }
                if (userQueries.length > 0) {
                    db.collection('Users').find({ $and: userQueries }).toArray().then((users) => {
                        if (users.length > 0) {
                            var temp2 = { $or: [] }
                            users.forEach(user => temp2.$or.push({ user_id: convertToObjectId(user._id) }));
                            mainQueries.push(temp2);
                        }
                        if (mainQueries.length === 0) {
                            reject("No queries found");
                            return
                        }
                        const query = { $and: mainQueries };
                        const result = db.collection('Messages').find(query).toArray();
                        if (result != null) {
                            resolve(result);
                        } else {
                            reject("Nothing matched the query");
                        }
                    }).catch((err) => {
                        reject(err);
                    });
                } else {
                    if (mainQueries.length === 0) {
                        reject("No queries found");
                        return
                    }
                    const query = { $and: mainQueries };
                    const result = db.collection('Messages').find(query).toArray();
                    if (result != null) {
                        resolve(result);
                    } else {
                        reject("Nothing matched the query");
                    }
                }
            }).catch((err) => {
                reject(err);
            });
        } else {
            if (userQueries.length > 0) {
                db.collection('Users').find({ $and: userQueries }).toArray().then((users) => {
                    if (users.length > 0) {
                        var temp3 = { $or: [] }
                        users.forEach(user => temp3.$or.push({ user_id: convertToObjectId(user._id) }));
                        mainQueries.push(temp3);
                    }
                    if (mainQueries.length === 0) {
                        reject("No queries found");
                        return
                    }
                    const query = { $and: mainQueries };
                    const result = db.collection('Messages').find(query).toArray();
                    if (result != null) {
                        resolve(result);
                    } else {
                        reject("Nothing matched the query");
                    }
                }).catch((err) => {
                    reject(err);
                });
            } else {
                if (mainQueries.length === 0) {
                    reject("No queries found");
                    return
                }
                const query = { $and: mainQueries };
                const result = db.collection('Messages').find(query).toArray();
                if (result != null) {
                    resolve(result);
                } else {
                    reject("Nothing matched the query");
                }

            }
        }
    });
}

/**
 * Retrieves threads from the database based on the specified query type.
 * @param {Object} db - The database object.
 * @param {string} queryType - The type of query to perform.
 * @param {number} count - The number of threads to retrieve.
 * @param {boolean} is_admin - Indicates whether the user is an admin.
 * @returns {Promise<Array>} - A promise that resolves to an array of threads.
 */
async function GetThreadByQuery(db, queryType, count, is_admin) {
    switch (queryType) {
        case "By-most-recent":
            return await GetFirstNThreadsByDate(db, count, is_admin);
    }
    console.log('Unknown query type');
    return null;
}

module.exports = {
    Search,
    DeleteMessage,
    DeleteThread,
    DeleteUser,
    GetUsersByQuery,
    PatchUser,
    CreateUser,
    GetUserMessages,
    GetUser,
    GetThreadMessages,
    CreateMessage,
    GetThreadByQuery,
    CreateThread,
    CreateServerMessage
};