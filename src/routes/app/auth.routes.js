const express = require("express");
const auth = require("../../middlewares/auth");
const { validate, validateView } = require("../../middlewares/validate");
const userValidation = require("../../validations/app/auth.validation");
const userController = require("../../controllers/app/auth.controller");
const { userType } = require("../../config/appConstants");

const router = express.Router();

router.post("/signup", validate(userValidation.signup), userController.signup);

router.post(
  "/verifyOtp",
  auth(userType.USER),
  validate(userValidation.verifyOtp),
  userController.verifyOtp
);
router.post("/resendOtp", auth(userType.USER), userController.resendOtp);

router.post("/login", validate(userValidation.userLogin), userController.login);

router.post(
  "/refreshTokens",
  auth(userType.USER),
  validate(userValidation.refreshTokens),
  userController.refreshTokens
);

router.post(
  "/logout",
  auth(userType.USER),
  validate(userValidation.logout),
  userController.logOut
);

router.post(
  "/socialLogin",
  validate(userValidation.socialLogin),
  userController.socialLogin
);

router.get(
  "/verify",
  validate(userValidation.getVerified),
  userController.getVerified
);

// router.post(
//   "/resendVerificationEmail",
//   validate(userValidation.getVerified),
//   userController.getVerified
// );

module.exports = router;
