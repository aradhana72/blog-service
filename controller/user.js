const userModel = require("../models/userModel");
const Joi = require("@hapi/joi");

const userSchema = Joi.object({
  name: Joi.string().min(6).required().optional(),
  email: Joi.string().min(6).required().email().optional(),
  password: Joi.string().min(6).required().optional(),
});

const updateUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const updateData = req.body; // Data to update the user with

    const { error } = await userSchema.validateAsync(updateData);
    if (error) {
      res.send("Invalid input!");
      res.status(400).send(error.details[0].message);
      return;
    } else {
      // Find the user by email and update the data
      const updatedUser = await userModel.findOneAndUpdate(
        { _id: userId },
        updateData,
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json(updatedUser);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.user._id; // Get the user's email from the query parameters

    // Find the user by email and update the data
    const deletedUser = await userModel.findOneAndDelete({
      _id: userId,
    });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(deletedUser);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getUser = async (req, res) => {
  const users = await userModel.find({});

  try {
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { updateUser, deleteUser, getUser };
