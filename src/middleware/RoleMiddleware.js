
const authorize = (roles) => {
  return (req, res, next) => {
    // Ensure that req.user.role exists (set during authentication)
    console.log(req);
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

module.exports = authorize;
