// dependecies
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// deployed
// require -> local file
const JWT_SECRET = process.env.JWT_SECRET || require("../secrets").JWT_SECRET;
const userModel = require("../model/userModel");
const { bodyChecker } = require("./utilFns");
const emailSender = require("../helpers/emailSender");
// router
const authRouter = express.Router();

// routes
authRouter.use(bodyChecker);
authRouter.route("/signup").post(signupUser);
authRouter.route("/login").post(loginUser);
authRouter.route("/forgetPassword").post(forgetPassword);
authRouter.route("/resetPassword").post(resetPassword);
// routes -> functions
async function signupUser(req, res) {
  try {
    let newUser = await userModel.create(req.body);
    res.status(200).json({
      message: "user created successfully",
      user: newUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
}
async function loginUser(req, res) {
  try {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (user) {
      // password
      let areEqual = await bcrypt.compare(req.body.password, user.password);

      if (areEqual) {
        console.log(JWT_SECRET);
        let token = jwt.sign({ id: user["_id"] }, JWT_SECRET);

        res.cookie("JWT", token);
        res.status(200).json({
          data: user,
          message: "user logged In",
        });
      } else {
        res.status(404).json({
          message: "email or password is incorrect",
        });
      }
    } else {
      res.status(404).json({
        message: "user not found with creds",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
}
async function forgetPassword(req, res) {
  try {
    let { email } = req.body;
    // search on the basis of email
    let user = await userModel.findOne({ email });
    if (user) {
      let token = (Math.floor(Math.random() * 10000) + 10000)
        .toString()
        .substring(1);
      await userModel.updateOne({ email }, { token });
      let newUser = await userModel.findOne({ email });
      await emailSender(token, user.email);

      res.status(200).json({
        message: "user token send to your email",
        user: newUser,
        token,
      });
    } else {
      res.status(404).json({
        message: "user not found with creds",
      });
    }
    // create token
    // -> update the user with a new token
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
}
async function resetPassword(req, res) {
  try {
    let { token, confirmPassword, password } = req.body;

    let user = await userModel.findOne({ token });
    console.log(user);
    if (user) {
      user.resetHandler(password, confirmPassword);
      await user.save();
      let newUser = await userModel.findOne({ email: user.email });
      res.status(200).json({
        message: "password updated",
        user: newUser,
      });
    } else {
      res.status(404).json({
        message: "user with this token not found",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
}
module.exports = authRouter;
