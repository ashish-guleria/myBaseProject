const { adminService, tokenService, userService } = require("../../services");
const { userType } = require("../../config/appConstants");
const { catchAsync, successMessage } = require("../../utils/universalFunction");

const adminLogin = catchAsync(async (req, res) => {
  let { email, password } = req.body;
  const admin = await adminService.adminLogin(email, password);
  const token = await tokenService.generateAuthToken(admin, userType.ADMIN);
  return res.send(successMessage(token));
});

module.exports = {
  adminLogin,
};
