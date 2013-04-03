var http            = require('http');
var fs              = require("fs");
var express         = require("express");
var CucumberBundler = require("cucumber/bundler");

var app = express();
app.use(express.logger({ format: "dev" }));
app.use(CucumberBundler());
app.use(express.static(__dirname + "/public"));

var port = process.env.PORT || 8000;

app.listen(port);

console.log("Server running on port " + port);
