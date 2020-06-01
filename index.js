const express = require("express"); //import express om te gebruiken. Express var is nu de express funcite
const app = express(); //koppel de var express aan de var app zodat je met alleen app epxress kan oproepen
const slug = require("slug"); //zorgt ervoor dat je geen html code in een formulier kan proppen.
const bodyParser = require("body-parser"); //maakt het makkelijker om de values uit een formulier te halen
const mongo = require("mongodb");

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

var store = new MongoDBStore({
  uri: process.env.DB_LINK,
  collection: "sessions",
});
require("dotenv").config();

app.listen(8090, () => console.log("server is working"));

app.use("/", express.static("static/style"));
app.use(bodyParser.urlencoded({ extended: true })); //ontvang data uit het formulier en gebruik data in de code

app.use(express.static(__dirname + "/static")); //zorgt dat ik mijn css en images bestanden kan linken aan mijn .ejs pagia's

//------SESSION AANMAKEN\

/* 1. Set the templating engine👇 */
app.set("view engine", "ejs");
app.set("views", "view");

app.get("/", users);
app.get("/form", form);
app.post("/", add);
app.post("/liked", like);

let db = null;
const url = process.env.DB_LINK;

mongo.MongoClient.connect(url, function (err, client) {
  if (err) {
    throw err;
  }
  db = client.db(process.env.DB_NAME);
});

//-------------SESSION----------------------------
const sessionId = "sessionId";
store.on("error", (err) => {
  console.log("Session MongoDB error:" + err);
});

app.use(
  require("express-session")({
    name: process.env.SES_NAME,
    secret: process.env.SES_SECRET,
    store: store,
    resave: false, //tussentijds dingen opslaan terwijl hij niks heeft aangepast hoeft niet!!
    saveUninitialized: false,
    cookie: {
      sameSite: true, //alleen cookies pakken die van jouw eigen website komen
      secure: false, //dit moet op true als je met https werkt
    },
  })
);

app.use((req, res, next) => {
  const { userId } = req.session;
  if (userId) {
    res.locals.user = user.find();
  }
});

//CONNECTING WITH MONGODB-------------------------------------------

//INSERT DATA WITH FORM------------------------------
function add(req, res, next) {
  db.collection("users").insertOne(
    {
      name: req.body.firstname,
      age: req.body.age,
      city: req.body.city,
      description: req.body.description,
      likes: "",
    },
    done
  );

  function done(err, data) {
    if (err) {
      next(err);
    } else {
      res.redirect("/");
    }
  }
}
//------------------ZET DATA TO ADD TO THE LIKE OR DISLIKE APP------------------------------------------

function users(req, res, next) {
  const IdCustomUser = db
    .collection("users")
    .find({
      name: "Simon",
    })
    .toArray(validate);
  function validate(err, profile) {
    if (err) {
      next(err);
    } else {
      console.log(profile);
      res.body._id = res.session.process.env.SES_NAME;
    }
  }

  db.collection("users").find().toArray(done);
  function done(err, user) {
    if (err) {
      next(err);
    } else {
      res.render("home.ejs", { data: user });
    }
  }
}

//-----------------------------------------------------

function like(req, res, next) {
  //req.session.userID =
  if (req.body.review === "like") {
    db.collection("users").updateOne(
      { _id: req.session },
      {
        $push: {
          likes: req.body.id,
        },
      }
    );
  }
}

//------------------------------

function form(req, res) {
  res.render("form");
}

app.use(function (req, res, next) {
  res.status(404).send("sorry, dit heb ik niet gevonden...");
}); //custom 404 error
