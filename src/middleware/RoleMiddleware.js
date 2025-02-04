// src/middleware/RoleMiddleware.js

const authorize = (allowedRoles) => {
  return (req, res, next) => {
    console.log(req.user.role)
    if (req.user && allowedRoles.includes(req.user.role)) {
      console.log(req.user.role)
      return next();
    }
    return res.status(403).json({ code: 403, message: "Access denied" });
  };
};

module.exports = authorize;
