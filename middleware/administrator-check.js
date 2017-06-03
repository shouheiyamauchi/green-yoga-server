const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');

/**
 *  Middleware to check if user is administrator
 */
module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).end();
  }

  // get the last part from a authorization header string like "bearer token-value"
  const token = req.headers.authorization.split(' ')[1];

  // decode the token using a secret key-phrase
  return jwt.verify(token, process.env.GREEN_YOGA_JWT, (err, decoded) => {
    // the 401 code is for unauthorized status
    if (err) {
      return res.status(401).end();
    }

    const userId = decoded.sub;

    // check if a user exists
    return User.findById(userId, (userErr, user) => {
      if (userErr || !user) {
        return res.status(401).end();
      }

      // Check if user is administrator
      if (user.role === "administrator") {
        return next();
      } else {
        return res.status(401).json({
          message: "You're not an authorized administrator to complete this action.",
          errors: {}
        });
      };
    });
  });
};
