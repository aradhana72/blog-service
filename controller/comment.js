const commentModel = require("../models/commentModel");
const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const commentSchema = Joi.object({
  blogId: Joi.string().hex().length(24).required(),
  userId: Joi.string().hex().length(24).required(),
  message: Joi.string().min(6).required(),
});

const addComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const blogId = req.query.blogId;
    const commentData = {
      blogId: blogId,
      userId: userId,
      message: req.body.message,
    };
    const { error } = await commentSchema.validateAsync(commentData);
    if (error) {
      res.send("Invalid input!");
      res.status(400).send(error.details[0].message);
      return;
    } else {
      const comment = new commentModel(commentData);
      const saveComment = await comment.save();
      res.json(saveComment);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const getCommentsByUserId = async (req, res) => {
  try {
    const userId = req.user._id;
    const commentsByUserId = await commentModel.aggregate([
      { $match: { userId: new ObjectId(userId) } },
      {
        $group: {
          _id: "$blogId",
          comments: {
            $push: {
              _id: "$_id",
              message: "$message",
            },
          },
        },
      },
    ]);

    res.send(commentsByUserId);
  } catch (error) {
    console.error("Aggregation error:", error);
    res.status(500).send(error);
  }
};

module.exports = { addComment, getCommentsByUserId };
