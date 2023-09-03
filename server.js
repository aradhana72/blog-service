var express = require("express");
require("dotenv").config();
var bodyParser = require("body-parser");
var app = express();
const mongoose = require("mongoose");
const protectedUserRouter = require("./routes/protectedUserRoutes");
const protectedBlogRouter = require("./routes/protectedBlogRoutes");
const protectedCommentRouter = require("./routes/protectedCommentRoutes");
const authRouter = require("./routes/authRoutes");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(protectedUserRouter);
app.use(authRouter);
app.use(protectedBlogRouter);
app.use(protectedCommentRouter);

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,

  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("MongoDb Connected successfully!!!");
});

app.listen(3000, () => {
  console.log("Server is running at port 3000");
});
