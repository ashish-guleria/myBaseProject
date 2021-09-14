const {
  adminUserService,
  tokenService,
  userService,
} = require("../../services");
const { userType } = require("../../config/appConstants");
const {
  catchAsync,
  successMessage,
  formatUser,
} = require("../../utils/commonFunction");

const getUsers = catchAsync(async (req, res) => {
  
  const data = await adminUserService.getUsers(
    req.query.page,
    req.query.limit,
    req.query.search
  );
  return res.send(successMessage(data));
});

const getUser = catchAsync(async (req, res) => {
  const userdata = await userService.getUserById(req.query.userId);
  let formatedUser = formatUser(userdata.toObject());
  return res.send(successMessage(formatedUser));
});

const block = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.body.userId);
  user.isBlocked
    ? (updateBody = { isBlocked: false })
    : (updateBody = { isBlocked: true });
  const updatedUser = await userService.findOneAndUpdate(
    req.body.userId,
    updateBody
  );
  await tokenService.deleteToken(updatedUser._id);

  return res.send(successMessage("User successfully blocked"));
});

module.exports = {
  getUsers,
  getUser,
  block,
};
