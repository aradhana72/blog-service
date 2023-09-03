const blogModel = require("../models/blogModel");
const userModel = require("../models/userModel");
const Joi = require("@hapi/joi");

const blogSchema = Joi.object({
  title: Joi.string().min(6).required(),
  content: Joi.string().min(6).required(),
  author: Joi.string().hex().length(24).required(),
});

const addBlog = async (req, res) => {
  try {
    const userId = req.user._id;
    const blogData = {
      title: req.body.title,
      content: req.body.content,
      author: userId,
    }; // Data to update the user with

    const { error } = await blogSchema.validateAsync(blogData);
    if (error) {
      res.send("Invalid input!");
      res.status(400).send(error.details[0].message);
      return;
    } else {
      const blog = new blogModel(blogData);
      const saveBlog = await blog.save();
      res.json(saveBlog);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const getBlogByUserId = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const blogs = await blogModel.find({ author: userId });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await blogModel.find().populate({
      path: "author",
      select: "_id name email",
      model: "User",
    });

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getBlogByBlogId = async (req, res) => {
  try {
    const blogId = req.query.blogId;
    const blogById = await blogModel.find({ _id: blogId }).populate({
      path: "author",
      select: "_id name email",
      model: "User",
    });
    if (!blogById) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blogById);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addBlog, getAllBlogs, getBlogByUserId, getBlogByBlogId };
