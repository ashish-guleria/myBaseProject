const Joi = require("joi");
const { objectId } = require("../custom.validation");

exports.adminLogin = {
  body: Joi.object().keys({
    email: Joi.string().email().lowercase().trim().required(),
    password: Joi.string().min(6).required(),
  }),
};
