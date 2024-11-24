const jwt = require("jsonwebtoken");
const configObject = require("../config/env.config");

const checkUserRole = (allowedRoles) => (req, res, next) => {
  const token = req.cookies[configObject.auth.cookie_token];
  if (token) {
    jwt.verify(token, configObject.auth.jwt_secret, (err, decoded) => {
      if (err) {
        res.render("404");
      } else {
        const userRole = decoded.user.role;
        if (allowedRoles.includes(userRole)) {
          req.userId = decoded.user._id;
          next();
        } else {
          res.render("404");
        }
      }
    });
  } else {
    res.render("404");
  }
};

module.exports = checkUserRole;
