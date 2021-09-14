const Joi = require("joi");
const { joi, linkType } = require("../../../config/appConstants");

exports.createLink = {
  body: Joi.object().keys({
    handle: Joi.string().required(),
    linkType: Joi.string()
      .valid(...Object.values(linkType))
      .required(),
    name: Joi.string().required(),
    thumbnail: Joi.string().required(),
  }),
};

exports.getLink = {
  query: Joi.object().keys({
    linkType: Joi.string()
      .valid(...Object.values(linkType))
      .required(),
    page: joi.PAGE,
    limit: joi.LIMIT,
  }),
};

exports.editLink = {
  body: Joi.object().keys({
    linkId: joi.OBJECTID,
    handle: Joi.string().required(),
    linkType: Joi.string()
      .valid(...Object.values(linkType))
      .required(),
    name: Joi.string().required(),
    thumbnail: Joi.string().required(),
  }),
};

exports.getSingleLink = {
  query: Joi.object().keys({
    linkId: joi.OBJECTID,
  }),
};
