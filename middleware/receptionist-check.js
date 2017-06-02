/**
 *  Middleware to check if user is receiptionist (or teacher/administrator)
 */
module.exports = (req, res, next) => {
  if (req.user.role === "administrator" || req.user.role === "teacher" || req.user.role === "receiptionist") {
    return next();
  } else {
    return res.status(401).json();
  };
};
