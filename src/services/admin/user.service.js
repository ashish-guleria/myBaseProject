const httpStatus = require("http-status");
const { User } = require("../../models");
const { ApiError } = require("../../utils/commonFunction");
const { userType } = require("../../config/appConstants");

const getUsers = async (page, limit, search) => {
  var query = {};

  if (search) {
    let searchRegex = RegExp(search, "i");

    query = {
      ...query,
      $or: [
        { name: { $regex: searchRegex } },
        // { phone: { $regex: search } }
      ],
    };
  }
  const options = {
    sort: { _id: -1 },
    skip: page * limit,
    limit: limit,
    lean: true,
  };

  const [users, count] = await Promise.all([
    User.find(query, {}, options),
    User.countDocuments(query),
  ]);
  return { users, count };
};

module.exports = {
  getUsers,
};
