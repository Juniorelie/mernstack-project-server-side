const router = require("express").Router();
const Post = require("../models/post.model");
const isAuth = require("../middlewares/isAuthenticated");
const isAdmin = require("../middlewares/isAdmin");
const { isValidObjectId } = require("mongoose");
const fileUploader = require("../config/cloudinaryConfig");

// Get all posts

router.get("/", isAuth, async (req, res, next) => {
  try {
    const posts = await Post.find().populate("userId");
    res.json(posts);
  } catch (error) {
    return next(error);
  }
});

// Get post by id

router.get("/:postId", async (req, res, next) => {
  const { postId } = req.params;
  if (!isValidObjectId(postId)) {
    console.log("Not a valid objectid", postId);
    return next();
  }
  const onePost = await Post.findOne({ _id: postId }).populate("userId");
  res.json({ post: onePost });
  try {
  } catch (error) {
    console.log(error);
  }
});

// Create a post

router.post(
  "/",
  isAuth,
  fileUploader.single("image"),
  async (req, res, next) => {
    const { title, description } = req.body;
    let image = "";

    if (req.file) {
      image = req.file.path;
    }

    const postToCreate = { title, image, description, userId: req.userId };

    const createdPost = await Post.create(postToCreate);

    res.status(201).json(createdPost);
    try {
    } catch (error) {
      console.log(error);
    }
  }
);

// Update a post

router.put("/:postId", isAuth, isAdmin, async (req, res, next) => {
  try {
    const { image, title, description } = req.body;
    const { postId } = req.params;
    const postToUpdate = { image, title, description };
    let updatedPost;
    // Find and update
    if (req.isAdmin) {
      updatedPost = await Post.findByIdAndUpdate(postId, postToUpdate, {
        new: true,
      });
    } else {
      updatedPost = await Post.findOneAndUpdate(
        { _id: postId, userId: req.userId },
        postToUpdate,
        { new: true }
      );
    }

    if (!updatedPost) {
      return res.status(401).json({ message: "Denied" });
    }

    res.status(202).json(updatedPost);
  } catch (error) {
    console.log(error);
  }
});

// Delete a post

router.delete("/:postId", isAuth, async (req, res, next) => {
  try {
    const { postId } = req.params;
    await Post.findOneAndDelete({ _id: postId, userId: req.userId });
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
