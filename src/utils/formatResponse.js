const formatUser = (userData) => {
  delete userData.otp;
  delete userData.__v;
  delete userData.password;
  delete userData.userType;
  delete userData.isBlocked;
  delete userData.isDeleted;
  return userData;
};

module.exports = {
  formatUser,
};
