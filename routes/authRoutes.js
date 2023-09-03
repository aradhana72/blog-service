const express = require("express");
var bodyParser = require("body-parser");
const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

var helpers = require("../controller/auth");

app.post("/register", helpers.registerUser);

app.post("/login", helpers.loginUser);

module.exports = app;
