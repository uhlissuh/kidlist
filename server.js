var http = require("http");
var fs = require("fs");
var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var handlebars = require("express-handlebars");
var database = require("./database");

var app = express();

var COOKIE_SIGNING_SECRET = "the-cookie-signing-secret";

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded());
app.use(cookieParser(COOKIE_SIGNING_SECRET));
app.use(express.static('public'));

app.get("/", function(req, res) {
  res.render('home');
});

app.get("/join", function(req, res) {
  res.render('join');
});

app.get("/login", function(req, res) {
  if (req.signedCookies["error_message"] != null) {
    res.clearCookie("error_message");
    res.render('login', {"error_message": "something"});
  } else {
    res.render('login');
  };
});

app.post("/join", function(req, res) {
  database.createUser(req.body, function(err) {
    res.writeHead(301, {'location' : "/"});
    res.end();
  });
});

app.post("/login", function (req, res) {
  database.signInUser(req.body, function(err, id) {
    if (id === null) {
      res.cookie("error_message", "Invalid username or password", {signed: true});
      res.writeHead( 302, { "Location": "/login" });
    } else {
      res.cookie("user_id", id, {signed: true});
      res.writeHead( 302, { "Location": "/" });
    }
    res.end();
  })
});

var server = http.createServer(app);
server.listen(8080);
console.log("server running on 8080");
