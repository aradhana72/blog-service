const express = require("express");
var bodyParser = require("body-parser");
const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const authVerify = require("../middlewares/authVerify");

var helpers = require("../controller/blog");

app.get("/blogs", authVerify, helpers.getAllBlogs);

app.get("/getBlogByUserId", authVerify, helpers.getBlogByUserId);

app.get("/getBlogByBlogId", authVerify, helpers.getBlogByBlogId);

app.post("/addBlog", authVerify, helpers.addBlog);

module.exports = app;
