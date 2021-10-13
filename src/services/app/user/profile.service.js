const httpStatus = require("http-status");
const { User } = require("../../../models");
const { ApiError } = require("../../../utils/universalFunction");

// const createUser = async (userBody) => {
//   if (await User.isEmailTaken(userBody.email)) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
//   }
//   const user = await User.create(userBody);
//   return user;
// };

const getUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email does not exist");
  }
  return user;
};

// const googleSignup = (userBody) => {
//   return User.findOneAndUpdate(
//     {
//       $or: [{ email: userBody.email }, { googleId: userBody.googleId }],
//     },
//     {
//       $set: { googleId: userBody.googleId, otp: "" },
//       $setOnInsert: { email: userBody.email, name: userBody.name },
//     },
//     { upsert: true, new: true }
//   );
// };

// const userLogin = async (email, password) => {
//   const user = await User.findOne({ email });
//   if (!user) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email");
//   }
//   if (!(await user.isPasswordMatch(password))) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect password");
//   }
//   return user;
// };

const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User does not exist exist");
  }
  return user;
};

const updateUserById = async (userData, updateBody) => {
  if (userData.email != updateBody.emai) {
    if (await User.isEmailTaken(updateBody.email, userData._id)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
    }
  }
  if (userData.phoneNumber != updateBody.phoneNumber) {
    if (await User.isPhoneNumberTaken(updateBody.phoneNumber, userData._id)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Phone number already taken");
    }
  }
  if (userData.userName != updateBody.userName) {
    if (await User.isUserNameTaken(updateBody.userName, userData._id)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User name already taken");
    }
  }

  const user = await User.findByIdAndUpdate(userData._id, updateBody, {
    new: true,
    lean: true,
  });
  return user;
};

const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await getUserById(userId);
  if (!(await user.isPasswordMatch(oldPassword))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect password");
  }
  let updatedPassword = { password: newPassword };
  Object.assign(user, updatedPassword);
  await user.save();
  return user;
};

const resetPassword = async (userId, password) => {
  const user = await getUserById(userId);
  let newPassword = password;
  Object.assign(user, newPassword);
  await user.save();
  return user;
};

const findOneAndUpdate = async (_id, updateBody) => {
  const result = User.findOneAndUpdate({ _id }, updateBody, { new: true });
  return result;
};

module.exports = {
  //createUser,
  //userLogin,
  getUserById,
  updateUserById,
  changePassword,
  //googleSignup,
  getUserByEmail,
  findOneAndUpdate,
  resetPassword,
};
