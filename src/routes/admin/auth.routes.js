const express = require("express");
const { validate } = require("../../middlewares/validate");
const auth = require("../../middlewares/auth");
const userController = require("../../controllers/admin/auth.controller");
const userValidation = require("../../validations/admin/auth.validation");
const { userType } = require("../../config/appConstants");

const router = express.Router();
const search = catchAsync(async (req, res) => {
    let options = {
      sort: { createdAt: -1 },
      skip: req.query.page * req.query.limit,
      limit: req.query.limit,
    };
    const result = await User.find(
      { name: { $regex: RegExp(req.query.name, "i") } },
      { password: 0, __v: 0, otp: 0 },
      options
    );
    return res.send(successMessage(result));
  });
router.post(
  "/login",
  validate(userValidation.adminLogin),
  userController.adminLogin
);

module.exports = router;
