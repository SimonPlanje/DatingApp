const express = require("express"); //import express om te gebruiken. Express var is nu de express funcite
const app = express(); //koppel de var express aan de var app zodat je met alleen app epxress kan oproepen

app.listen(8090, () => console.log("server is working"));
app.use(express.static("static"));

app.get("/about", sendAbout);
function sendAbout(req, res) {
  res.send("dit is de about pagina");
}

//custom 404 error :)
app.use(function (req, res, next) {
  res.status(404).send("sorry, dit heb ik niet gevonden...");
});
