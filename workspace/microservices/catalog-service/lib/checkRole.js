const jwt = require("jsonwebtoken");
/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns
 */
const isAdminRole = (req, res, next) => {
  if (!req.headers.authorization) {
    res.sendStatus(401);
  }

  jwt.verify(
    req.headers?.authorization?.split(" ")?.pop(),
    "MY SECRET KEY",
    (error, user) => {
      if (!user?.isAdmin || error) res.sendStatus(403);

      req.user = user;
    }
  );

  next();
};

module.exports = isAdminRole;