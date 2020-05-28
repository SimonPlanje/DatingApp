const express = require("express"); //import express om te gebruiken. Express var is nu de express funcite
const app = express(); //koppel de var express aan de var app zodat je met alleen app epxress kan oproepen
const slug = require("slug"); //zorgt ervoor dat je geen html code in een formulier kan proppen.
const bodyParser = require("body-parser"); //maakt het makkelijker om de values uit een formulier te halen
const mongo = require("monogodb");
require("dotenv").config();

app.listen(8090, () => console.log("server is working"));

app.use("/", express.static("static/style"));
app.use(bodyParser.urlencoded({ extended: true })); //ontvang data uit het formulier en gebruik data in de code

app.use(express.static(__dirname + "/static")); //zorgt dat ik mijn css en images bestanden kan linken aan mijn .ejs pagia's

/* 1. Set the templating engine👇 */
app.set("view engine", "ejs");
app.set("views", "view");

app.get("/", index);
app.get("/users", users);
app.get("/form", form);
app.post("/users", add);
app.post("/liked", liken);

//like gedeelte
app.get("/liked", likepage);

//CONNECTING WITH MONGODB-------------------------------------------
const var = db;
  const uri = process.env.DB_LINK;
 
  mongo.MongoClient.connect(url, function (err, client){
    if (err)
  })



main().catch(console.error);
//------------------------------------------------------------
function index(req, res) {
  res.send("Hello Templating!");
}

/* 2. Send the data with the template 👇 */
function users(req, res) {
  res.render("home", { data: data });
}

function form(req, res) {
  res.render("form.ejs");
}

function likepage(req, res) {
  res.render("liked.ejs");
}

function add(req, res) {
  let id = slug(req.body.firstname).toLowerCase();

  data.push({
    firstname: req.body.firstname,
    age: req.body.age,
    city: req.body.city,
    description: req.body.description,
  });
  res.redirect("/users");
}

function liken(req, res) {
  let id = slug(req.body.firstname).toLowerCase();

  liked.push({
    firstname: req.body.firstname,
    age: req.body.age,
    city: req.body.city,
    description: req.body.description,
  });
  res.redirect("/liked");
}

/* 3. List of rappers as an array of objects 👇 */

let data = [];
let liked = [];
let disliked = [];

app.use(function (req, res, next) {
  res.status(404).send("sorry, dit heb ik niet gevonden...");
}); //custom 404 error :)
