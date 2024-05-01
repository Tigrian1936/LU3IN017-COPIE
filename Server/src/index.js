const express = require('express')
const app = express();
const cors = require('cors');
const {MongoClient, Collection, MongoAzureError} = require('mongodb');
const api = require('./api.js');
app.use(express.json())
app.use(cors());
const dburl = "mongodb+srv://victorlocherer:blQqG6A9ZpIX4p3Q@clusterprojet.etclz03.mongodb.net/"
const client = new MongoClient(dburl);




client
.connect()
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.error('Error connecting to MongoDB:', err);
    });

app.use((req, res, next) => {
  req.db = client.db('DatabaseProjet'); // Attach the database to the request
  next();
});
app.post('/threads', async (req, res)=>{
    api.CreateThread(req.db, req.body.original_poster_id, req.body.title, req.body.is_admin).then((thread_id) => {
      api.CreateServerMessage(req.db, thread_id.insertedId, req.body.original_poster_id, req.body.title, req.body.is_admin)
      res.status(200).json({thread_id : thread_id.insertedId});
    })
    .catch(reason => {
      res.status(400).json({message : reason.message});
    });
});

app.get('/threads/:thread_id', async (req, res)=>{
  api.GetThreadMessages(req.db, req.params.thread_id).then((messages)=>{
    res.status(200).json({messages : messages});
  }).catch(reason =>{
    res.status(400).json({message : reason.message});
  })
});

app.post('/threads/:thread_id', async (req, res)=>{
  api.CreateMessage(req.db, req.params.thread_id, req.body.user_id, req.body.text).then(() => {
    res.status(200).json({message : "Message created"});
  }).catch(reason => {
    res.status(400).json({message : reason.message});
  });
});

app.get('/users/:user_id', async (req, res)=>{
  if(req.params.user_id === "0"){
    res.status(200).json({user : {username : "Server", logo : ""}, messages : []});
    return;
  }
  api.GetUser(req.db, req.params.user_id).then((user)=>{
    api.GetUserMessages(req.db, req.params.user_id).then((messages)=>{
      res.status(200).json({user: user, messages : messages});
    }).catch(reason =>{
      res.status(400).json({message : reason.message});
    })
  }).catch(reason =>{
    res.status(400).json({message : reason.message});
  })
});

app.put('/users/:user_id', async (req, res)=>{
  api.PromoteUser(req.db, req.params.user_id).then(() => {
    res.status(200).json({message : "User promoted"});
  }).catch(reason => {
    res.status(400).json({message : reason.message});
  });
});


app.get('/threads', async (req, res)=>{
  api.GetThreadByQuery(req.db, req.query.queryType, req.query.count).then((threads)=>{
    res.status(200).json(threads);
  }).catch(reason =>{
    res.status(400).json({message : reason.message});
  })
});

app.post('/authentication/login', async (req, res)=>{
    const collection = req.db.collection('Users');
    const query = {username: req.body.login, password: req.body.password};
    const options = {projection: {_id: 1, username: 1, password: 1, register_date : 1, is_admin : 1, approved: 1}};
    const result = await collection.findOne(query, options);
    if(result != null){
      res.status(200).json(result);
    } else {
        res.status(401).json({message: "Unknown user"});
    }
});

app.post('/users/:user_id', async (req, res)=>{
  api.ApproveUser(req.db, req.params.user_id).then(() => {
    res.status(200).json({message : "User approved"});
  }).catch(reason => {
    res.status(400).json({message : reason.message});
  });
});

app.get('/users', async (req, res)=>{
    api.GetUsersByQuery(req.db, req.query.queryType).then((users)=>{
        res.status(200).json(users);
    }).catch(reason =>{
        res.status(400).json({message : reason.message});
    })
});

app.post('/users', async (req, res)=>{
  api.CreateUser(req.db, req.body.login, req.body.password, req.body.admin).then((user_id) => {
    res.status(200).json({user_id : user_id.insertedId});
  })
  .catch(reason => {
    res.status(400).json({message : reason.message});
  });
});

// start express server on port 5000
app.listen(5000, () => {
  console.log("server started on port 5000");
});

