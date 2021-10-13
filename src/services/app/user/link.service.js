const { BAD_REQUEST } = require("http-status");
const httpStatus = require("http-status");
const { Link } = require("../../../models");
const { ApiError } = require("../../../utils/universalFunction");

const createLink = async (userId, data) => {
  console.log(userId);
  data.userId = userId;

  if (await Link.findOne({ userId, handle: data.handle })) {
    throw new ApiError(BAD_REQUEST, "You have already created this link");
  }
  const link = await Link.create(data);
  return link;
};

const getLink = async (userId, linkType, page, limit) => {
  const options = {
    sort: { _id: -1 },
    skip: page * limit,
    limit,
    lean: true,
  };
  const links = await Link.find(
    { userId, linkType, isDeleted: false },
    {},
    options
  );
  return links;
};

const updateLink = async (userId, updateBody) => {
  const link = await Link.findOneAndUpdate(
    { _id: updateBody.linkId },
    updateBody,
    {
      new: true,
      lean: true,
    }
  );
  return link;
};

const getLinkById = async (linkId) => {
  const link = await Link.findOne({ _id: linkId, isDeleted: false });
  if (!link) {
    throw new ApiError(NOT_FOUND, "Link does not exist");
  }
  return link;
};

module.exports = {
  createLink,
  getLink,
  updateLink,
  getLinkById,
};
