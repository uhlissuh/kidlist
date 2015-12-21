var http = require("http");
var fs = require("fs");
var express = require("express");
var bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.urlencoded());
app.use(express.static('public'));

app.get("/", function(req, res) {
  fs.readFile("index.html", "utf8", function(err, data) {
    res.end(data);
  });
})

var server = http.createServer(app);
server.listen(8080);
console.log("server running on 8080");
