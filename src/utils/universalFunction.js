const { SUCCESS } = require("../config/responseMessage");
class ApiError extends Error {
  constructor(language, errorMsg) {
    if (language && language == "ar") {
      super(errorMsg.customMessage.ar);
    } else {
      super(errorMsg.customMessage.en);
    }
    this.statusCode = errorMsg.statusCode;
  }
}

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.log(err);
    next(err);
  });
};

const successMessage = (language, successMsg, data) => {
  if (
    typeof successMsg == "object" &&
    successMsg.hasOwnProperty("statusCode") &&
    successMsg.hasOwnProperty("customMessage")
  ) {
    let message = successMsg.customMessage.en;
    if (language && language == "ar") {
      message = successMsg.customMessage.ar;
    }
    return { code: successMsg.statusCode, message, data };
  } else {
    successMsg = SUCCESS.DEFAULT.customMessage.en;
    if (language && language == "ar") {
      message = successMsg.customMessage.ar;
    }
    return { code: 200, message: successMsg, data };
  }
};

module.exports = { ApiError, catchAsync, successMessage };
