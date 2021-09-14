const { tokenService, authService } = require("../../services");
const { userType } = require("../../config/appConstants");
const httpStatus = require("http-status");
const {
  catchAsync,
  ApiError,
  successMessage,
  formatUser,
} = require("../../utils/commonFunction");
const config = require("../../config/config");
const { verifyAccount } = require("../../utils/sendMail");
const sendOtp = require("../../utils/sendOtp");

const signup = catchAsync(async (req, res) => {
  const otpData = await sendOtp(req.body.phoneNumber);
  req.body.otp = otpData;

  const user = await authService.createUser(req.body);

  const token = await tokenService.generateAuthTokens(user, userType.USER);
  const emailVerifyToken = await tokenService.generateResetPasswordToken(
    req.body.email
  );
  await verifyAccount(req.body.email, emailVerifyToken);
  let formatedUser = formatUser(user.toObject());
  return res.send(successMessage({ token, user: formatedUser }));
});

const verifyOtp = catchAsync(async (req, res) => {
  await authService.verifyOtp(
    req.token.user._id,
    req.token.user.otp.code,
    req.body.otp
  );
  res.send(successMessage("", "OTP verified successfully", 200));
});

const resendOtp = catchAsync(async (req, res) => {
  const otpData = await sendOtp(req.token.user.phoneNumber);
  await authService.resendOtp(req.token.user._id, otpData);
  res.send(successMessage("", "OTP successfull sended", 200));
});

const socialLogin = catchAsync(async (req, res) => {
  const user = await authService.socialLogin(req.body);
  const token = await tokenService.generateAuthTokens(user, userType.USER);
  let formatedUser = formatUser(user.toObject());
  return res.send(successMessage({ token, user: formatedUser }));
});

const login = catchAsync(async (req, res) => {
  let { userName, password } = req.body;
  const user = await authService.userLogin(userName, password);

  if (user.isBlocked) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Your account has been blocked");
  }
  if (!user.isVerified) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Please verify your account first"
    );
  }
  const token = await tokenService.generateAuthTokens(user, userType.USER);
  let formatedUser = formatUser(user.toObject());
  return res.send(successMessage({ token, user: formatedUser }));
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await tokenService.refreshAuth(req.token.token);
  return res.send(successMessage(tokens));
});

const logOut = catchAsync(async (req, res) => {
  console.log(req.token);

  await tokenService.logout(req.token.token);
  return res.send(successMessage("You are successfully logged out"));
});

const getVerified = catchAsync(async (req, res) => {
  const tokendata = await tokenService.verifyResetPasswordToken(
    req.query.token
  );
  await authService.verifyUser(tokendata.user);
  return res.render("commonMessage", {
    title: "Account Verification",
    successMessage: "Your account is successfully verified",
    projectName: config.projectName,
  });
});



module.exports = {
  signup,
  login,
  refreshTokens,
  logOut,
  socialLogin,
  getVerified,
  verifyOtp,
  resendOtp,
};
