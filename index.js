const express = require("express"); //import express om te gebruiken. Express var is nu de express funcite
const app = express(); //koppel de var express aan de var app zodat je met alleen app epxress kan oproepen
app.listen(8000, () => console.log("server is working"));

//set the view enginge
app.set("view engine", "ejs");
//set the views map as the template map.
app.set("views", "view");

var data = [
  {
    id: "simon",
    name: "Simon",
    surname: "Planje",
    age: "19",
  },
];

//open de view index pagina
app.get("/", function (req, res) {
  res.render("home"); //normaal gebruik je res.send om een static html pagina te laden, met res.render kan je dynamische templates inladen.
});

app.get("/person", function (req, res) {
  res.render("person");
});

function users(req, res) {
  res.render("home.ejs", { data: data });
}

//custom 404 error :)
app.use(function (req, res, next) {
  res.status(404).send("sorry, dit heb ik niet gevonden...");
});
