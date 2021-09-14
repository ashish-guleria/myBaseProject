const httpStatus = require("http-status");
const { User } = require("../../models");
const { ApiError } = require("../../utils/commonFunction");
const { joi, loginType } = require("../../config/appConstants");

const socialLogin = (userBody) => {
  const username = "user_" + Math.random().toString(36).substr(2, 3);

  if (userBody.loginType == loginType.FACEBOOK) {
    return User.findOneAndUpdate(
      {
        $or: [{ email: userBody.email }, { facebookId: userBody.socialId }],
      },
      {
        $set: { facebookId: userBody.socialId },
        $setOnInsert: {
          email: userBody.email,
          name: userBody.name,
          userName: username,
          isVerified: true,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  return User.findOneAndUpdate(
    {
      $or: [{ email: userBody.email }, { appleId: userBody.socialId }],
    },
    {
      $set: { appleId: userBody.socialId },
      $setOnInsert: {
        email: userBody.email,
        name: userBody.name,
        userName: username,
        isVerified: true,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

const createUser = async (userBody) => {
  if (await User.isUserNameTaken(userBody.userName)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User name already taken");
  }
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "email already taken");
  }
  if (await User.isPhoneNumberTaken(userBody.phoneNumber)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Phone number already taken");
  }
  const user = await User.create(userBody);
  return user;
};

const userLogin = async (userName, password) => {
  const user = await User.findOne({ userName });
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User doest not exist");
  }
  if (!(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect password");
  }
  return user;
};

const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User does not exist exist");
  }
  return user;
};

const findOneAndUpdate = async (_id, updateBody) => {
  const result = User.findOneAndUpdate({ _id }, updateBody, { new: true });
  return result;
};

const verifyUser = async (userId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { isVerified: true },
    { new: true, lean: true }
  );
  return user;
};

const verifyOtp = async (userId, enterOtp, savedOtp) => {
  if (enterOtp != savedOtp) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Incorrect OTP");
  }
  const user = await User.findByIdAndUpdate(
    userId,
    {
      isVerified: true,
      $unset: { otp: "" },
    },
    { new: true, lean: true }
  );
  return user;
};

const resendOtp = async (userId, otpdata) => {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: { otp: otpdata },
    },
    { new: true, lean: true }
  );
  return user;
};

module.exports = {
  socialLogin,
  userLogin,
  getUserById,
  createUser,
  findOneAndUpdate,
  verifyUser,
  verifyOtp,
  resendOtp,
};
