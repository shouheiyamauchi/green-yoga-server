/**
 *  Middleware to check if user is administrator
 */
module.exports = (req, res, next) => {
  if (req.user.role === "administrator") {
    return next();
  } else {
    return res.status(401).json({
      message: "You're not an authorized administator."
    });
  };
};
