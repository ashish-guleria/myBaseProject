const Joi = require("joi");
const { joi, loginType } = require("../../config/appConstants");

exports.signup = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    university: Joi.string().required(),
    club: Joi.string().required(),
    userName: Joi.string().lowercase().trim().required(),
    email: joi.EMAIL,
    password: joi.PASSWORD,
    phoneNumber: joi.PHONENUMBER,
  }),
};

exports.socialLogin = {
  body: Joi.object().keys({
    loginType: Joi.string()
      .valid(...Object.values(loginType))
      .required(),
    socialId: Joi.string().required(),
    name: Joi.string().allow(""),
    email: Joi.string().allow("").email().lowercase().trim(),
  }),
};

exports.getVerified = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

exports.userLogin = {
  body: Joi.object().keys({
    userName: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

exports.verifyOtp={
  body: Joi.object().keys({
    otp:Joi.number().min(000000).max(999999).required()
  })

}