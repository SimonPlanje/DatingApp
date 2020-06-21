const express = require('express'); //import express om te gebruiken. Express var is nu de express funcite
const app = express(); //koppel de var express aan de var app zodat je met alleen app epxress kan oproepen
const slug = require('slug'); //zorgt ervoor dat je geen html code in een formulier kan proppen.
const bodyParser = require('body-parser'); //maakt het makkelijker om de values uit een formulier te halen
require('dotenv').config();

//CONST FOR DB
const mongo = require('mongodb');
const ObjectId = mongo.ObjectID;
let db = null;
const url = process.env.DB_LINK;
let userDB = null;
let matchDB = null;

//CONST FOR SESSION
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const sessionId = 'sessionId';
const sessionSecret = process.env.SES_SECRET;
const store = new MongoDBStore({
  uri: url,
  collection: 'sessions',
});

mongo.MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    throw err;
  }
  db = client.db(process.env.DB_NAME);
  userDB = db.collection('users');
  matchDB = db.collection('match');
});

app.listen(1000, () => console.log('server is working'));

//------SESSION AANMAKEN\

app.use(
  require('express-session')({
    name: sessionId,
    secret: sessionSecret,
    store: store,
    resave: false, //tussentijds dingen opslaan terwijl hij niks heeft aangepast hoeft niet!!
    saveUninitialized: false,
    cookie: {
      sameSite: true, //alleen cookies pakken die van jouw eigen website komen
      secure: false, //dit moet op true als je met https werkt
    },
  })
);

app.use('/', express.static('static/style'));
app.use(bodyParser.urlencoded({ extended: true })); //ontvang data uit het formulier en gebruik data in de code

app.use(express.static(__dirname + '/static')); //zorgt dat ik mijn css en images bestanden kan linken aan mijn .ejs pagia's

app.set('view engine', 'ejs');
app.set('views', 'views');

//----------------THIS IS WHERE THE MAGIC BEGINS-----------------------

//POST FORM

app.get('/', async (req, res) => {
  res.render('form');
});

app.post('/', (req, res) => {
  const data = {
    name: req.body.firstname,
    age: req.body.age,
    city: req.body.city,
    description: req.body.description,
    likes: [],
    megalikes: [],
    number: 0,
  };

  //check if data is inserted
  if (data) {
    //creatre sesssion id
    req.session.sessionId = data;
    // console.log('session id =');
    // console.log(req.session.sessionId);
    //insert data to database
    userDB.insertOne(data);
    console.log('added ' + data.name + ' to database');
    console.log(req.session);

    res.redirect('/home');
  } else {
    console.log('Data did not load, try again!');
  }
});

//GET HOMEPAGE
app.get('/home', async (req, res) => {
  if (req.session.sessionId._id) {
    const users = await userDB
      .find({ _id: { $ne: ObjectId(req.session.sessionId._id) } })
      .toArray();

    const index = await userDB.findOne({
      _id: ObjectId(req.session.sessionId._id),
    });
    res.render('home', { userData: users[index.number] });
  }
});

//LIKE DISLIKE OR MEGALIKE THE USER-----------------

app.post('/like', async (req, res) => {
  if (req.body.review === 'like') {
    userDB.updateOne(
      {
        _id: ObjectId(req.session.sessionId._id),
      },
      {
        $inc: { number: 1 },
        $push: {
          likes: req.body.id,
        },
      }

    );
    userDB.updateMany({}, { $set: { 'likes.$[]': ObjectId(req.body.id) } });
    req.session.sessionId.likes.push(ObjectId(req.body.id));
    res.redirect('home');

  } else if (req.body.review === 'dislike') {
    userDB.updateOne(
      {
        _id: ObjectId(req.session.sessionId._id),
      },
      {
        $inc: { number: 1 },
      }

    );
    res.redirect('home');

  } else if (req.body.review === 'megalike') {
    userDB.updateOne(
      {
        _id: ObjectId(req.session.sessionId._id),
      },
      {
        $inc: { number: 1 },
        $push: {
          megalikes: req.body.id,
        },
      }
    );
    userDB.updateMany({}, { $set: { 'likes.$[]': ObjectId(req.body.id) } });
    req.session.sessionId.megalikes.push(ObjectId(req.body.id));
    res.redirect('home');

  }


  if(req.body.delete){
    console.log("delteAccount")
    const id = req.session.sessionId._id;

    // remove user
    userDB.deleteOne({_id: ObjectId(id)});
    res.redirect('/')
    req.session.destroy();

  }

});

app.get('/likes', async (req, res) => {
  if (req.session.sessionId.likes) {
    console.log(req.session.sessionId.likes);
    const usersIds = await userDB
      .find({ _id: { $in: req.session.sessionId.likes } })
      .toArray();
    console.log(usersIds);


    res.render('liked', { users: usersIds });
  }


});
// ------------------------------

app.use(function (req, res, next) {
  res.status(404).send('sorry, dit heb ik niet gevonden...');
}); //custom 404 error
