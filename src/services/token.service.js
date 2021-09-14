const jwt = require("jsonwebtoken");
const moment = require("moment");
const httpStatus = require("http-status");
var ObjectID = require("mongodb").ObjectID;

const config = require("../config/config");
const { tokenTypes } = require("../config/appConstants");
const { Token, User } = require("../models");
const { userProfileService } = require("../services");
const { ApiError } = require("../utils/commonFunction");

const generateToken = (
  userId,
  expires,
  type,
  userType,
  tokenId,
  secret = config.jwt.secret
) => {
  const payload = {
    userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
    role: userType,
    tokenId,
  };
  return jwt.sign(payload, secret);
};

const saveToken = async (
  token,
  userId,
  expires,
  type,
  tokenId,
  blacklisted = false
) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
    tokenId,
    _id: tokenId,
  });
  return tokenDoc;
};

const generateAuthTokens = async (user, userType) => {
  const accessTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    "minutes"
  );
  var tokenId = new ObjectID();
  const accessToken = generateToken(
    user.id,
    accessTokenExpires,
    tokenTypes.ACCESS,
    userType,
    tokenId
  );
  const refreshTokenExpires = moment().add(
    config.jwt.refreshExpirationDays,
    "days"
  );
  const refreshToken = generateToken(
    user.id,
    refreshTokenExpires,
    tokenTypes.REFRESH,
    userType
  );
  await saveToken(
    refreshToken,
    user.id,
    refreshTokenExpires,
    tokenTypes.REFRESH,
    tokenId
  );
  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

const verifyToken = async (token) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({
    token,
    type: payload.type,
    user: payload.userId,
  });
  if (!tokenDoc) {
    throw new Error("Token not found");
  }
  return tokenDoc;
};

const refreshAuth = async (refreshToken) => {
  const refreshTokenDoc = await verifyToken(refreshToken);
  const user = await userProfileService.getUserById(refreshTokenDoc.user);

  await refreshTokenDoc.remove();
  return generateAuthTokens(user, user.userType);
};

const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    type: tokenTypes.REFRESH,
    blacklisted: false,
  });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found");
  }
  return await refreshTokenDoc.remove();
};

//////////////////////////////////////////////////////////////////////////////////////////////////
const generateResetPasswordToken = async (email) => {
  const user = await userProfileService.getUserByEmail(email);

  const expires = moment().add(
    config.jwt.resetPasswordExpirationMinutes,
    "day"
  );
  const resetPasswordToken = generateToken(
    user.id,
    expires,
    tokenTypes.RESET_PASSWORD
  );
  await saveToken(
    resetPasswordToken,
    user.id,
    expires,
    tokenTypes.RESET_PASSWORD
  );
  return resetPasswordToken;
};

const verifyResetPasswordToken = async (token) => {
  try {
    await jwt.verify(token, config.jwt.secret);
    const tokenData = await Token.findOne({
      token,
      expires: { $gte: new Date() },
    });
    return tokenData;
  } catch (error) {
    throw error;
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////

const deleteToken = async (userId) => {
  await Token.deleteMany({ user: userId });
};

module.exports = {
  generateAuthTokens,
  saveToken,
  refreshAuth,
  logout,
  generateResetPasswordToken,
  verifyResetPasswordToken,
  deleteToken,
};
