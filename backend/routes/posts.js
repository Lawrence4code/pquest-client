const express = require("express");

const checkAuth = require("../middleware/check-auth");
const PostsController = require("../controllers/posts");
const extractFile = require("../middleware/image-extract");

const expressRouter = express.Router();

//***************** Protect Routes *****************/
// create new post route
expressRouter.post("", checkAuth, extractFile, PostsController.createPost);

// update post
expressRouter.put("/:id", checkAuth, extractFile, PostsController.updatePost);

// delete route
expressRouter.delete("/:id", checkAuth, PostsController.deletePost);

//***************** General Routes *****************/
// get all posts
expressRouter.get("", PostsController.getAllPosts);

// get individual post
expressRouter.get("/:id", PostsController.getSinglePost);

module.exports = expressRouter;
