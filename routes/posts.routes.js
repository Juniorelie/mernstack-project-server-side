const router = require("express").Router();
const Post = require("../models/post.model");
const isAuth = require("../middlewares/isAuthenticated");
const isAdmin = require("../middlewares/isAdmin");
const { isValidObjectId } = require("mongoose");
const fileUploader = require("../config/cloudinaryConfig");

// Get all posts

router.get("/", isAuth, async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate("userId");
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
    next(error);
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
      next(error);
    }
  }
);

// Update a post

router.put("/:postId", isAuth, isAdmin, async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const { postId } = req.params;
    const postToUpdate = { title, description };
    console.log("here's request body", req.body);
    let updatedPost;
    // Find and update
    if (req.isAdmin) {
      updatedPost = await Post.findByIdAndUpdate(postId, postToUpdate, {
        new: true,
      });
      console.log("The user is admin", updatedPost);
    } else {
      updatedPost = await Post.findOneAndUpdate(
        { _id: postId, userId: req.userId },
        postToUpdate,
        { new: true }
      );
      console.log("The user is not admin", updatedPost);
    }

    if (!updatedPost) {
      return res.status(401).json({ message: "Denied" });
    }

    res.status(202).json(updatedPost);
  } catch (error) {
    next(error);
  }
});

// Like a post
router.post("/:postId/like", isAuth, async (req, res, next) => {
  const { postId } = req.params;
  if (!isValidObjectId(postId)) {
    return res.status(400).json({ message: "Invalid post ID" });
  }
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.likes.includes(req.userId)) {
      return res.status(400).json({ message: "Post already liked" });
    }

    post.likes.push(req.userId);
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
});

// Unlike a post
router.post("/:postId/unlike", isAuth, async (req, res, next) => {
  const { postId } = req.params;
  if (!isValidObjectId(postId)) {
    return res.status(400).json({ message: "Invalid post ID" });
  }
  try {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: req.userId },
      },
      { new: true }
    );
    // if (!post) {
    //   return res.status(404).json({ message: "Post not found" });
    // }

    // const likeIndex = post.likes.indexOf(req.userId);
    // if (likeIndex === -1) {
    //   return res.status(400).json({ message: "Post not liked" });
    // }

    // post.likes.splice(likeIndex, 1);
    // await post.save();
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
});

// Delete a post

router.delete("/:postId", isAuth, async (req, res, next) => {
  try {
    const { postId } = req.params;
    await Post.findOneAndDelete({ _id: postId, userId: req.userId });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
