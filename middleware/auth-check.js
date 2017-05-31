const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');

/**
 *  The Auth Checker middleware function.
 */
module.exports = (req, res, next) => {
  console.log(req.headers)
  
  if (!req.headers.authorization) {
    console.log("error 1");
    return res.status(401).end();
  }

  // get the last part from a authorization header string like "bearer token-value"
  const token = req.headers.authorization.split(' ')[1];

  // decode the token using a secret key-phrase
  return jwt.verify(token, process.env.GREEN_YOGA_JWT, (err, decoded) => {
    // the 401 code is for unauthorized status
    if (err) {
      console.log("error 2");
      return res.status(401).end();
    }

    const userId = decoded.sub;

    // check if a user exists
    return User.findById(userId, (userErr, user) => {
      if (userErr || !user) {
        console.log("error 3");
        return res.status(401).end();
      }
      // pass user details onto next route
      req.user = user
      return next();
    });
  });
};
