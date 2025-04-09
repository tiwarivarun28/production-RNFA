const express = require("express");
const {
  registerController,
  loginController,
  updateUserController,
  requireSignIn,
} = require("../controllers/userController");

//router object
const router = express.Router();

//routes
//regiter || post
router.post("/register", registerController);
//login  || post
router.post("/login", loginController);
//update
router.put("/update-user", requireSignIn, updateUserController);

//export
module.exports = router;
