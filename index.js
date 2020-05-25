const express = require("express"); //import express om te gebruiken. Express var is nu de express funcite
const app = express(); //koppel de var express aan de var app zodat je met alleen app epxress kan oproepen
const slug = require("slug"); //zorgt ervoor dat je geen html code in een formulier kan proppen.
var bodyParser = require("body-parser"); //maakt het makkelijker om de values uit een formulier te halen

app.listen(8090, () => console.log("server is working"));

app.use("/", express.static("static/style"));
app.use(bodyParser());

/* 1. Set the templating engine👇 */
app.set("view engine", "ejs");
app.set("views", "view");

app.get("/", index);
app.get("/users", users);
app.get("/form", form);
app.post("/form", fillInForm);

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

function fillInForm(req, res) {
  res.end(JSON.stringify(req.body));
}

/* 3. List of rappers as an array of objects 👇 */

const data = [
  {
    id: "simon",
    name: "Simon",
    city: "Hilversum",
    age: "19",
    info:
      "Hoi! ik ben Simon. Hou van sporten en heel veel lorem ipsum in mijn over mij stukje plakken! Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut voluptate distinctio error quidem, perspiciatis porro voluptates numquam sint nesciunt labore est quam nihil explicabo deserunt necessitatibus ipsum rerum reprehenderit ad!",
  },
  {
    id: "josje",
    name: "Josje",
    city: "Diemen",
    age: "22",
    info:
      "Hoi! ik ben Josje uit Diemen. Hou van sporten en heel veel lorem ipsum in mijn over mij stukje plakken! Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut voluptate distinctio error quidem, perspiciatis porro voluptates numquam sint nesciunt labore est quam nihil explicabo deserunt necessitatibus ipsum rerum reprehenderit ad!",
  },
];

app.use(function (req, res, next) {
  res.status(404).send("sorry, dit heb ik niet gevonden...");
}); //custom 404 error :)
