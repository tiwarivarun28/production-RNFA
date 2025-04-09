const JWT = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModel = require("../models/userModel");
var { expressjwt: jwt } = require("express-jwt");

//middleware
const requireSignIn = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

//register
const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //validation
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "name is required",
      });
    }
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "email is required",
      });
    }
    if (!password || password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "password is required min 6 character",
      });
    }
    //existing user
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(500).send({
        success: false,
        message: "user already registered",
      });
    }
    //hash-password
    const hashedPassword = await hashPassword(password);
    //save user
    const user = await userModel({
      name,
      email,
      password: hashedPassword,
    }).save();
    return res.status(201).send({
      success: true,
      message: "Registration successfull please login",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "error in register api",
      error,
    });
  }
};

//login
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Please provide email or password",
      });
    }
    //find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "User not found",
      });
    }
    //match password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(500).send({
        success: false,
        message: "Invalid username or password",
      });
    }
    //token JWT
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    //undefined password
    user.password = undefined;
    return res.status(200).send({
      success: true,
      message: "Logged in Successfully",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "error in login api",
    });
  }
};

//update user
const updateUserController = async (req, res) => {
  try {
    const { name, password, email } = req.body;
    const user = await userModel.findOne({ email });
    //password valiadte
    if (password && password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "password is req and 6 char long",
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    //updated user
    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      {
        name: name || user.name,
        password: hashedPassword || user.password,
      },
      { new: true }
    );
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Profile Updated Please Login",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in user update api",
      error,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  updateUserController,
  requireSignIn,
};
