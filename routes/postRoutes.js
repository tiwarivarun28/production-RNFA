const express = require("express");
const { requireSignIn } = require("../controllers/userController");
const {
  createPostController,
  getAllPostController,
  getUserPostController,
  deletePostController,
  updatePostController,
} = require("../controllers/postController");

//router object
const router = express.Router();

//create post || POST
router.post("/create-post", requireSignIn, createPostController);

//get all post
router.get("/get-all-post", getAllPostController);
router.get("/get-user-post", requireSignIn, getUserPostController);

//deleete post
router.delete("/delete-post/:id", requireSignIn, deletePostController);

//uppdate post 
router.put("/update-post/:id", requireSignIn, updatePostController);

//export
module.exports = router;
