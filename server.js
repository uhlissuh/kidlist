var http = require("http");
var fs = require("fs");
var express = require("express");
var bodyParser = require("body-parser");
var handlebars = require("express-handlebars");
var database = require("./database");

var app = express();

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded());
app.use(express.static('public'));

app.get("/", function(req, res) {
  res.render('home');
});

app.get("/join", function(req, res) {
  res.render('join');
})

app.post("/join", function(req, res) {
  database.createUser(req.body, function(err) {
    res.writeHead(301, {'location' : "/"});
    res.end();
  });
});

var server = http.createServer(app);
server.listen(8080);
console.log("server running on 8080");
