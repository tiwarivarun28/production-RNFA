const postModel = require("../models/postModel");

const createPostController = async (req, res) => {
  try {
    const { title, description } = req.body;
    //validate
    if (!title || !description) {
      res.status(500).send({
        success: false,
        message: "Please provide all fields",
      });
    }
    const post = await postModel({
      title,
      description,
      postedBy: req.auth._id,
    }).save();
    res.status(201).send({
      success: true,
      message: "Post Created Successfully",
      post,
    });
    console.log(req);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in create post APi",
      error,
    });
  }
};

const getAllPostController = async (req, res) => {
  try {
    const post = await postModel
      .find()
      .populate("postedBy", "_id name")
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "All post data",
      post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get all post APi",
      error,
    });
  }
};

const getUserPostController = async (req, res) => {
  try {
    const userPosts = await postModel.find({ postedBy: req.auth._id });
    res.status(200).send({
      success: true,
      message: "User post data",
      userPosts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get user post APi",
      error,
    });
  }
};

const deletePostController = async (req, res) => {
  try {
    const { id } = req.params;
    await postModel.findByIdAndDelete({ _id: id });
    res.status(200).send({
      success: true,
      message: "Your post has been deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in delete post APi",
      error,
    });
  }
};

const updatePostController = async (req, res) => {
  try {
    const { title, description } = req.body;
    //find post
    const post = await postModel.findById({ _id: req.params.id });
    //validation
    if (!title || !description) {
      return res.status(500).send({
        success: false,
        message: "Please provide post title or description",
      });
    }
    const updatedPost = await postModel.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      {
        title: title || post?.title,
        description: description || post?.description,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Post Updated Successfully",
      updatedPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update post APi",
      error,
    });
  }
};

module.exports = {
  createPostController,
  getAllPostController,
  getUserPostController,
  deletePostController,
  updatePostController,
};
