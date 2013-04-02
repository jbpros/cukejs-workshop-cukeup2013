var http = require('http');
var fs = require("fs");
var express = require("express");
var CucumberBundler = require("cucumber/bundler");

var app = express();
app.use(express.logger({ format: "dev" }));
app.use(CucumberBundler());
app.use(express.static(__dirname + "/public"));
app.listen(8000);

console.log("Server running at http://127.0.0.1:8000/");
