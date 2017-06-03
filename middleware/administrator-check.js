const express = require('express');
const app = express();
const authCheck = require('./auth-check');

/**
 *  Middleware to check if user is administrator
 */
module.exports = (req, res, next) => {
  app.use(authCheck);
  if (req.user.role === "administrator") {
    return next();
  } else {
    return res.status(401).json({
      message: "You're not an authorized administrator to complete this action.",
      errors: {}
    });
  };
};
