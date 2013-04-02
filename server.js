// Load the http module to create an http server.
var http = require('http');
var fs = require("fs");
var express = require("express");

var app = express();
app.use(express.static(__dirname + "/public"));

//app.get("/", function (req, res) {
//  fs.readFile(__dirname + "/index.html", function (err, content) {
//    if (err) throw err;
//    res.end(content);
//  });
//});

//     // Listen on port 8000, IP defaults to 127.0.0.1
app.listen(8000);
//
//     // Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:8000/");
