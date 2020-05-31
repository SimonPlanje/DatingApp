const express = require("express"); //import express om te gebruiken. Express var is nu de express funcite
const app = express(); //koppel de var express aan de var app zodat je met alleen app epxress kan oproepen
const slug = require("slug"); //zorgt ervoor dat je geen html code in een formulier kan proppen.
const bodyParser = require("body-parser"); //maakt het makkelijker om de values uit een formulier te halen
const mongo = require("mongodb");
const session = require("express-session");
require("dotenv").config();

app.listen(8090, () => console.log("server is working"));

app.use("/", express.static("static/style"));
app.use(bodyParser.urlencoded({ extended: true })); //ontvang data uit het formulier en gebruik data in de code

app.use(express.static(__dirname + "/static")); //zorgt dat ik mijn css en images bestanden kan linken aan mijn .ejs pagia's

//------SESSION AANMAKEN\
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
  })
);

/* 1. Set the templating engine👇 */
app.set("view engine", "ejs");
app.set("views", "view");

app.get("/", users);
app.get("/form", form);
app.get("/liked", liked);
app.post("/", add);

//CONNECTING WITH MONGODB-------------------------------------------
let db = null;
const url = process.env.DB_LINK;

mongo.MongoClient.connect(url, function (err, client) {
  if (err) {
    throw err;
  }

  db = client.db(process.env.DB_NAME);
});

//INSERT DATA WITH FORM------------------------------
function add(req, res, next) {
  db.collection("users").insertOne(
    {
      name: req.body.firstname,
      age: req.body.age,
      city: req.body.city,
      description: req.body.description,
      geliked: "nog niet",
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
  db.collection("users").find({ geliked: "nog niet" }).toArray(done);
  function done(err, user) {
    if (err) {
      next(err);
    } else {
      res.render("home.ejs", { data: user });
    }
  }
}

function liked(req, res, next) {
  db.collection("likeduser").find({ geliked: "liked" }).toArray(done);
  function done(err, user) {
    if (err) {
      next(err);
    } else {
      res.render("liked.ejs", { data: likeduser });
    }
  }
}

// function liked(req, res, next) {
//   db.collection("users").updateOne(
//     { _id: ObjectID(req.body_id), $set: { geliked: req.body.review.value } },
//     done
//   );

//   function done(err, likeduser) {
//     if (err) {
//       next(err);
//     } else {
//       res.redirect("/liked", { data: likeduser });
//     }
//   }
// }
//------------------ZET DATA TO ADD TO THE LIKE OR DISLIKE APP------------------------------------------

// function like(req, res, next) {
//   db.collection("users").updateOne(
//     { _id: client.ObjectID(req.body._id) },
//     {
//       $set: { geliked: "like" },
//     }
//   );
// }
//--------------------------

function form(req, res) {
  res.render("form");
}

// function likepage(req, res) {
//   res.render("liked.ejs");
// }

// function add(req, res) {
//   let id = slug(req.body.firstname).toLowerCase();

//   db.collection("users").insertOne({
//     firstname: req.body.firstname,
//     age: req.body.age,
//     city: req.body.city,
//     description: req.body.description,
//   });
//   res.redirect("/users");
// }

// function (req, res) {
//   let id = slug(req.body.firstname).toLowerCase();

//   liked.push({
//     firstname: req.body.firstname,
//     age: req.body.age,
//     city: req.body.city,
//     description: req.body.description,
//   });
//   res.redirect("/liked");
// }

// let data = [];
// let liked = [];
// let disliked = [];

app.use(function (req, res, next) {
  res.status(404).send("sorry, dit heb ik niet gevonden...");
}); //custom 404 error :)
