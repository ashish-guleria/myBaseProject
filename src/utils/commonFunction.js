class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.log(err);
    next(err);
  });
};

const successMessage = (data, message, statusCode) => {
  if (message) {
    return { statusCode, message, data };
  }
  return { statusCode: 200, message: "success", data };
};

const formatUser = (userData) => {
  delete userData.otp;
  delete userData.__v;
  delete userData.password;
  delete userData.userType;
  delete userData.isBlocked;
  delete userData.isDeleted;
  return userData;
};

module.exports = { ApiError, catchAsync, successMessage, formatUser };
