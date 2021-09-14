const passport = require("passport");
const httpStatus = require("http-status");
const { ApiError } = require("../utils/commonFunction");

const verifyCallback =
  (req, resolve, reject, role) => async (err, token, info) => {
    if (err || info || !token || !token.user) {
      return reject(
        new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate")
      );
    }
    if (role && token.role != role) {
      return reject(
        new ApiError(
          httpStatus.UNAUTHORIZED,
          "You are not authorize to perform this action"
        )
      );
    }

    if (req.url == "/verifyOtp" || req.url == "/resendOtp") {
      req.token = token;
      resolve();
    }
    if (!token.user.isVerified) {
      return reject(
        new ApiError(httpStatus.BAD_REQUEST, "Please verify you account first")
      );
    }

    if (token.user.isBlocked) {
      return reject(
        new ApiError(
          httpStatus.BAD_REQUEST,
          "Your account is blocked please contact to admin"
        )
      );
    }
    req.token = token;
    resolve();
  };

const auth = (role) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "jwt",
      { session: false },
      verifyCallback(req, resolve, reject, role)
    )(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = auth;
