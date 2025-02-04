// src/middleware/RoleMiddleware.js

const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (req.user && allowedRoles.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({ code: 403, message: "Access denied" });
  };
};

module.exports = authorize;
