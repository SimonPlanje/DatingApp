const express = require("express"); //import express om te gebruiken. Express var is nu de express funcite
const app = express(); //koppel de var express aan de var app zodat je met alleen app epxress kan oproepen
const slug = require("slug"); //zorgt ervoor dat je geen html code in een formulier kan proppen.
const bodyParser = require("body-parser"); //maakt het makkelijker om de values uit een formulier te halen
require("dotenv").config();

//CONST FOR DB
const mongo = require("mongodb");
let db = null;
const url = process.env.DB_LINK;
let userDB = null;

//CONST FOR SESSION
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const sessionId = "sessionId";
const sessionSecret = process.env.SES_SECRET;
const store = new MongoDBStore({
  uri: url,
  collection: "sessions",
});

mongo.MongoClient.connect(url, function (err, client) {
  if (err) {
    throw err;
  }
  db = client.db(process.env.DB_NAME);
  userDB = db.collection("users");
});

app.listen(8090, () => console.log("server is working"));

//------SESSION AANMAKEN\

app.use(
  require("express-session")({
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

app.use("/", express.static("static/style"));
app.use(bodyParser.urlencoded({ extended: true })); //ontvang data uit het formulier en gebruik data in de code

app.use(express.static(__dirname + "/static")); //zorgt dat ik mijn css en images bestanden kan linken aan mijn .ejs pagia's


/* 1. Set the templating engine👇 */
app.set("view engine", "ejs");
app.set("views", "view");

function home(req, res) {
  res.render("form");
}
app.get("/", form);
app.post("/", add);
app.get('/home', home);
app.post("/home", liken);
app.get("/likes", likepage)
//-------------SESSION----------------------------

app.use((req, res, next) => {
  const { userId } = req.session;
  if (userId) {
    res.locals.user = user.find();
  }
});

//CONNECTING WITH MONGODB-------------------------------------------

//INSERT DATA WITH FORM------------------------------
function add(req, res, next) {
  userDB.insertOne({
    name: req.body.firstname,
    age: req.body.age,
    city: req.body.city,
    description: req.body.description,
    likes: "",
  });

  userDB.findOne(
    {
      name: req.body.firstname
    },
    function (err, data) {
      if (err) {
        console.log("It is not working");
      } else {
        // console.log(data);

        req.session.sessionId = data._id;
        res.redirect("/home");
        // console.log(req.sesssion.sessionId);
      }
    }
  );
}

function home(req, res) {
  userDB.find({}).toArray((err, result) => {
    if (err) {
      res.send(err);
    } else if (result.length) {
      res.render('home', {
        'userprops': result
      });
      console.log(result);
      console.log("wa;lasdf")
    } else {
      res.send('No data found');
    }
  });
};

function liken(req, res) {
  userDB.updateOne({
    _id: req.session.sessionId
  }, {
    $push: {
      likes: req.body.id
    }
  });

  userDB.findOne({
    _id: req.session.sessionId
  }, (err, user) => {
    if (err) {
      console.log('MongoDB Error:' + err);
    } else {
      console.log(user.likes);
    }
  });
}

function likepage(req, res) {
  userDB.findOne({
    _id: req.session.sessionId
  }, (err, user) => {
    if (err) {
      console.log('MongoDB Error:' + err);
    } else {
      userDB.find({ "_id": { "$in": [user.likes] } })((err, users) => {
        if (err) {
          console.log('MongoDB Error:' + err);
        } else {
          console.log(users);
        }
      });
    }
  });
}

// db.getCollection('feed').find({ "_id": { "$in": [likes] } })
//------------------ZET DATA TO ADD TO THE LIKE OR DISLIKE APP------------------------------------------

// function users(req, res, next) {
//   userDB.findOne(
//     {
//       name: req.body.firstname,
//     },
//     function (err, user) {
//       if (err) {
//         next(err);
//       } else {
//         req.session.sessionId = user._id;
//         console.log(user._id);
//       }
//     }
//   );
// }

//-----------------------------------------------------

// function like(req, res, next) {
//   //req.session.userID =
//   if (req.body.review === "like") {
//     db.collection("users").updateOne(
//       { _id: req.session },
//       {
//         $push: {
//           likes: req.body.id,
//         },
//       }
//     );
//   }
// }

//------------------------------

function form(req, res) {
  res.render("form");
}

app.use(function (req, res, next) {
  res.status(404).send("sorry, dit heb ik niet gevonden...");
}); //custom 404 error
