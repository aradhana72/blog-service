const express = require("express");
var bodyParser = require("body-parser");
const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const authVerify = require("../middlewares/authVerify");

var helpers = require("../controller/comment");

app.post("/addComment", authVerify, helpers.addComment);
app.get("/getCommentsByUserId", authVerify, helpers.getCommentsByUserId);

module.exports = app;
