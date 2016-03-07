var http = require("http");
var fs = require("fs");
var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var handlebars = require("express-handlebars");
var database = require("./database");
var dashboardView = require('./views/dashboard_view');
database.setURL("postgres://alissa:@localhost/kidlist");
var app = express();

var COOKIE_SIGNING_SECRET = "the-cookie-signing-secret";

app.set('views', __dirname + '/templates');
app.set('view engine', 'handlebars');

app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  layoutsDir: __dirname + '/templates/layouts'
}));

app.use(bodyParser.urlencoded());
app.use(cookieParser(COOKIE_SIGNING_SECRET));
app.use(express.static('public'));

app.get("/", function(req, res) {
  if (req.signedCookies["user_id"]) {
    database.getKids(req.signedCookies["user_id"], function(err, result) {
      res.render('dashboard', dashboardView(result, new Date()));
    });
  } else {
    res.render('home', {layout: 'promo'});
  }
});

app.get("/signout", function(req, res) {
  res.clearCookie("user_id");
  res.writeHead(301, {'location' : "/"});
  res.end();
});

app.get("/join", function(req, res) {
  res.render('join', {layout: 'promo'});
});

app.get("/login", function(req, res) {
  if (req.signedCookies["error_message"] != null) {
    res.clearCookie("error_message");
    res.render('login', {"error_message": "something", layout: 'promo'});
  } else {
    res.render('login', {layout: 'promo'});
  }
});

app.get("/children/new", function(req, res) {
  res.render('new_child_form');
});

app.post("/join", function(req, res) {
  var user = {
    "first_name": req.body.first_name,
    "last_name": req.body.last_name,
    "biz_name": req.body.biz_name,
    "city": req.body.city,
    "state": req.body.state,
    "email": req.body.email,
    "password": req.body.password,
    "confirm_password": req.body.confirm_password,
  };
  database.createUser(user, function(err, id) {
    res.cookie("user_id", id, {signed: true});
    res.writeHead(301, {'location' : "/"});
    res.end();
  });
});

app.post("/children/new", function(req, res) {
  if (req.signedCookies["user_id"] != null) {
    userId = req.signedCookies["user_id"];
    database.createKid(userId, req.body, function(err) {
      if(err) {
        console.log(err);
        res.writeHead(500);
        res.end("something went wrong");
        return;
      }
      res.writeHead(301, {'location' : "/"});
      res.end();
    });
  } else {
    res.writeHead(403);
    res.end("forbidden!");
  }
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
  });
});

var server = http.createServer(app);
server.listen(8080);
console.log("server running on 8080");
