/**
 *  Middleware to check if user is teacher (or administrator)
 */
module.exports = (req, res, next) => {
  if (req.user.role === "administrator" || req.user.role === "teacher") {
    return next();
  } else {
    return res.status(401).json();
  };
};
