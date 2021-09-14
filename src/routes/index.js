const express = require("express");
const userAuth = require("./app/auth.routes");
const userProfile = require("./app/user/profile.routes");
const userLinks = require("./app/user/link.routes");

const adminAuth = require("./admin/user.routes");
const adminUser = require("./admin/user.routes");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/app/user/profile",
    route: userProfile,
  },
  {
    path: "/app/user/link",
    route: userLinks,
  },
  {
    path: "/app/user/auth",
    route: userAuth,
  },
  {
    path: "/admin/auth",
    route: adminAuth,
  },
  {
    path: "/admin/user",
    route: adminUser,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
