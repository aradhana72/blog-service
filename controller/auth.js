const express = require("express");
var bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
const userModel = require("../models/userModel");

const registerSchema = Joi.object({
  name: Joi.string().min(6).required(),
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
});

const registerUser = async (req, res) => {
  const emailExist = await userModel.findOne({ email: req.body.email });

  if (emailExist) {
    res.send("Email already Exists!");
  }

  const saltedPassword = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, saltedPassword);

  try {
    const { error } = await registerSchema.validateAsync(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    } else {
      const user = new userModel({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });
      const saveUser = await user.save();
      res.status(200).send("user created");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const loginSchema = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
});

const loginUser = async (req, res) => {
  const userExist = await userModel.findOne({ email: req.body.email });
  if (!userExist) {
    res.send("Email doesn't exists!!!");
  }

  const validPassword = await bcrypt.compare(
    req.body.password,
    userExist.password
  );
  if (!validPassword) {
    res.send("Incorrect Password!!!");
  }
  try {
    const { error } = await loginSchema.validateAsync(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    else {
      const token = jwt.sign({ _id: userExist._id }, process.env.TOKEN_SECRET);
      res.header("auth-token", token).send(token);
      console.log("Logged in!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { registerUser, loginUser };
