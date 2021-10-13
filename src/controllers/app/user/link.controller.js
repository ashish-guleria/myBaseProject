const { userLinkService } = require("../../../services");
const { userType, linkType } = require("../../../config/appConstants");
const httpStatus = require("http-status");

const {
  catchAsync,
  ApiError,
  successMessage,
  formatUser,
} = require("../../../utils/universalFunction");
const config = require("../../../config/config");

const createLink = catchAsync(async (req, res) => {
  const link = await userLinkService.createLink(req.token.user._id, req.body);
  return res.send(successMessage(link));
});

const getLink = catchAsync(async (req, res) => {
  const links = await userLinkService.getLink(
    req.token.user._id,
    req.query.linkType,
    req.query.page,
    req.query.limit
  );
  return res.send(successMessage(links));
});

const editLink = catchAsync(async (req, res) => {
  const link = await userLinkService.updateLink(req.token.user._id, req.body);
  return res.send(successMessage(link));
});

const getSingleLink = catchAsync(async (req, res) => {
  const link = await userLinkService.getLinkById(req.query.linkId);
  return res.send(successMessage(link));
});

module.exports = {
  createLink,
  getLink,
  editLink,
  getSingleLink,
};
