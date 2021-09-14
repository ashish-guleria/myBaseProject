const express = require("express");
const auth = require("../../../middlewares/auth");
const { validate } = require("../../../middlewares/validate");
const userValidation = require("../../../validations/app/user/link.validation");
const userController = require("../../../controllers/app/user/link.controller");
const { userType } = require("../../../config/appConstants");

const router = express.Router();

router
  .route("/")
  .post(
    auth(userType.USER),
    validate(userValidation.createLink),
    userController.createLink
  )
  .get(
    auth(userType.USER),
    validate(userValidation.getLink),
    userController.getLink
  )
  .put(
    auth(userType.USER),
    validate(userValidation.editLink),
    userController.editLink
  );

router.get(
  "/single",
  auth(userType.USER),
  validate(userValidation.getSingleLink),
  userController.getSingleLink
);

module.exports = router;
