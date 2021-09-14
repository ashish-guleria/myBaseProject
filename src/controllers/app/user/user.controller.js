const { userProfileService, tokenService } = require("../../../services");
const { userType } = require("../../../config/appConstants");
const httpStatus = require("http-status");
const Token = require("../../../models/token.model");
const { forgotPasswordEmail } = require("../../../utils/sendMail");
const {
  catchAsync,
  ApiError,
  successMessage,
  formatUser,
} = require("../../../utils/commonFunction");
const config = require("../../../config/config");

const getUser = catchAsync(async (req, res) => {
  let formatedUser = formatUser(req.token.user);
  return res.send(successMessage(formatedUser));
});

const editProfile = catchAsync(async (req, res) => {
  const user = await userProfileService.updateUserById(
    req.token.user,
    req.body
  );
  let formatedUser = formatUser(user);
  return res.send(successMessage(formatedUser));
});

const changePassword = catchAsync(async (req, res) => {
  await userProfileService.changePassword(
    req.token.user._id,
    req.body.oldPassword,
    req.body.newPassword
  );
});

/////////////////////////////////////forgot password///////////////////////////////////////////

const forgotPassword = catchAsync(async (req, res) => {
  const token = await tokenService.generateResetPasswordToken(req.body.email);
  await forgotPasswordEmail(req.body.email, token);
  return res.send(successMessage("Email successfully Sended"));
});

const forgotPage = async (req, res) => {
  try {
    const tokenData = await tokenService.verifyResetPasswordToken(
      req.query.token
    );
    if (tokenData) {
      return res.render("./forgotPassword/forgotPassword", {
        title: "Forgot Password",
        token: tokenData.token,
        projectName: config.projectName,
      });
    }
    return res.render("commonMessage", {
      title: "Forgot Password",
      errorMessage: "Sorry, this link has expired",
      projectName: config.projectName,
    });
  } catch (error) {
    res.render("commonMessage", {
      title: "Forgot Password",
      errorMessage: "Sorry, this link has expired",
      projectName: config.projectName,
    });
  }
};

const resetForgotPassword = catchAsync(async (req, res) => {
  try {
    const token = req.query.token;
    const tokenData = await tokenService.verifyResetPasswordToken(token);

    if (!tokenData)
      return res.render("commonMessage", {
        title: "Forgot Password",
        errorMessage: "Sorry, this link has expired",
        projectName: config.projectName,
      });

    let updateBody = {
      password: req.body.newPassword,
    };
    await userProfileService.resetPassword(tokenData.user, updateBody);
    await Token.deleteOne({ token });
    return res.render("commonMessage", {
      title: "Forgot Password",
      successMessage: "Your password is successfully changed",
      projectName: config.projectName,
    });
  } catch (error) {
    res.render("commonMessage", {
      title: "Forgot Password",
      errorMessage: "Sorry, this link has expired",
      projectName: config.projectName,
    });
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {
  getUser,
  editProfile,
  changePassword,
  forgotPassword,
  forgotPage,
  resetForgotPassword,
};
