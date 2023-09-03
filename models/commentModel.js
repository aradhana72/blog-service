const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
    min: 6,
  },
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
