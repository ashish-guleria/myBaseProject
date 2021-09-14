const Joi = require("joi");
const { objectId } = require("../custom.validation");

exports.search = {
  query: Joi.object().keys({
    name: Joi.string().lowercase().required(),
    limit: Joi.number(),
    page: Joi.number(),
  }),
};

exports.getUsers = {
  query: Joi.object().keys({
    limit: Joi.number(),
    page: Joi.number(),
    search: Joi.string().allow(""),
  }),
};

exports.getUser = {
  query: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
};

exports.block = {
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
};
