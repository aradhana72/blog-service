const express = require("express");
var bodyParser = require("body-parser");
const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const authVerify = require("../middlewares/authVerify");

var helpers = require("../controller/user");

app.put("/user", authVerify, helpers.updateUser);

app.delete("/user", authVerify, helpers.deleteUser);

app.get("/user", authVerify, helpers.getUser);

module.exports = app;
