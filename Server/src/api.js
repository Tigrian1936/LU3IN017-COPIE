const { ObjectId } = require('mongodb');

const UsersQueryType = {
    NONAPPROVED: "get-non-approved-users",
};
function convertToObjectId(id){
    if(id instanceof ObjectId){return id;}
    return new ObjectId(id);
}

async function GetAllThreads(db)
{
    const query = {};
    const options = {projection: {_id : 0, original_poster_id : 1,  creation_date : 1, title : 1, is_admin : 1}};
    const result = await db.collection('Threads').find(query, options);
    return await result.toArray();
}

async function CreateUser(db, username, password, admin) {
    const query = {username : username};
    const options = {projection: {_id : 1}};
    const data = await db.collection('Users').findOne(query, options);
    return new Promise((resolve, reject) => {
        if(data != null){
            reject("User already exists");
        }
        else {
            const user = {username : username, password : password, register_date : Date.now(), is_admin : admin, approved : admin};
            const user_id = db.collection('Users').insertOne(user);
            resolve(user_id);
        }
    });
}
async function GetThreadMessages(db, thread_id){
    return new Promise((resolve, reject) => {
        const query = { thread_id : convertToObjectId(thread_id)};
        const options = { projection: { _id: 1, thread_id : 1, text: 1, user_id: 1, publish_date: 1, is_admin : 1} };
        const messages = db.collection('Messages').find(query, options).toArray();
        if(messages != null){
            resolve(messages);
        }
        else {
            reject("No messages found");
        }
    });
}
async function GetThreadsNewerThan(db, date)
{
    const query = {creation_date : {$gt : date}};
    const options = {projection: {_id : 0, original_poster_id : 1,  creation_date : 1, title : 1, is_admin : 1}};
    const result = await db.collection('Threads').find(query, options);
    return await result.toArray();
}

async function GetFirstNThreadsByDate(db, n)
{
    return new Promise((resolve, reject) => {
        const query ={};
        const options = {projection: {_id : 1, original_poster_id : 1,  creation_date : 1, title : 1, is_admin : 1}, sort : {creation_date : 1}, limit : n};
        const result = db.collection('Threads').find(query, options).toArray();
        if(result != null){
            resolve(result);
        }
        else {
            reject("No threads found");
        }   
    });
}

async function CreateMessage(db, thread_id, user_id, text){
    return new Promise((resolve, reject) => {
        const query = {_id  : convertToObjectId(user_id)};
        const options = {projection: {_id : 0, username : 1}};
        const user = db.collection('Users').findOne(query, options);
        const message = {thread_id : convertToObjectId(thread_id), user_id : convertToObjectId(user_id), text : text, publish_date : Date.now()};
        db.collection('Messages').insertOne(message).then(() => {
            resolve();
        }).catch((err) => {
            reject(err);
        });
    });

}

async function GetUser(db, user_id){
    return new Promise((resolve, reject) => {
        const query = {_id  : convertToObjectId(user_id)};
        const options = {projection: {_id : 1, username : 1, logo : 1}};
        const user = db.collection('Users').findOne(query, options);
        if(user != null){
            resolve(user);
        }
        else {
            reject("User not found");
        }
    });
}
async function GetUserMessages(db, user_id){
    return new Promise((resolve, reject) => {
        const query2 = {user_id : convertToObjectId(user_id)};
        const options2 = {projection: {_id : 1, thread_id : 1, user_id : 1, text : 1, publish_date : 1, is_admin : 1}};
        const messages = db.collection('Messages').find(query2, options2).toArray();
        if(messages != null){
            resolve(messages);
        }
        else {
            reject("User not found");
        }
    });
}

async function ApproveUser(db, user_id){
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

async function CreateServerMessage(db, thread_id, user_id, title, is_admin){
    return new Promise((resolve, reject) => {
        const query = {_id  : user_id};
        const options = {projection: {_id : 0, username : 1}};
        const user = db.collection('Users').findOne(query, options);
        const text = `Thread ${title} created by ${user.username} (${new Date(Date.now()).toLocaleDateString()})`;
        const message = {thread_id : thread_id, user_id : 0, text : text, publish_date : Date.now(), is_admin : is_admin};
        db.collection('Messages').insertOne(message).then(() => {
            resolve();
        }).catch((err) => {
            reject(err);
        });
    });

}

async function CreateThread(db, original_poster_id, title, is_admin){
    const query = {original_poster_id : original_poster_id, title : title, is_admin : is_admin}
    const options = {projection: {_id : 1}};
    const data = await db.collection('Threads').findOne(query, options);
    return new Promise((resolve, reject) => {
        if(data != null){
            reject("Thread already exists");
        }
        else {
            const thread = {original_poster_id : original_poster_id, title : title, is_admin : is_admin, creation_date : Date.now()};
            const thread_id = db.collection('Threads').insertOne(thread);
            resolve(thread_id);
        }
    });
}

async function GetThreadByTitle(db, title){
    const query = {title: title};
    const options = {projection: {_id : 0, original_poster_id : 1,  creation_date : 1, title : 1, is_admin : 1}};
    const result = await db.collection('Threads').findOne(query, options);
    return await result.toArray();
}

async function GetNonApprovedUsers(db){
    return new Promise((resolve, reject) => {
        const query = {approved : false};
        const options = {projection: {_id : 1, username : 1}};
        const users = db.collection('Users').find(query, options).toArray();
        if(users != null){
            resolve(users);
        }
        else {
            reject("No non-approved users found");
        }
    });
}

async function GetUsersByQuery(db, queryType, count){
    switch(queryType){
        case UsersQueryType.NONAPPROVED:
            return await GetNonApprovedUsers(db);
    }
    console.log('Unknown query type');
    return null;
}
async function GetThreadById(db, thread_id){
    const query = {_id: thread_id};
    const options = {projection: {_id : 0, original_poster_id : 1,  creation_date : 1, title : 1, is_admin : 1}};
    const result = await db.collection('Threads').findOne(query, options);
    return await result.toArray();
}

async function GetAllThreadsOfUser(db, user_id){
    const query = {original_poster_id : user_id};
    const options = {projection: {_id : 0, original_poster_id : 1,  creation_date : 1, title : 1, is_admin : 1}};
    const result = await db.collection('Threads').find(query, options);
    return await result.toArray();
}

async function GetThreadByQuery(db, queryType, count){
    switch(queryType){
        case "By-most-recent":
            return await GetFirstNThreadsByDate(db, count);
    }
    console.log('Unknown query type');
    return null;
}

module.exports = {GetAllThreads, GetUsersByQuery, ApproveUser, CreateUser, GetUserMessages, GetUser, GetThreadMessages, CreateMessage, GetThreadsNewerThan, GetFirstNThreadsByDate, GetThreadByQuery, CreateThread, GetThreadByTitle, GetThreadById, CreateServerMessage, GetAllThreadsOfUser};