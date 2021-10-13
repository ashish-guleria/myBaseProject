const httpStatus = require("http-status");
const { User } = require("../../models");
const { ApiError } = require("../../utils/universalFunction");
const { userType } = require("../../config/appConstants");

const adminLogin = async (email, password) => {
  const admin = await User.findOne({ email, userType: userType.ADMIN });
  //console.log(user)
  if (!admin) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email");
  }
  if (!(await admin.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect password");
  }
  return admin;
};

module.exports = {
  adminLogin,
};
