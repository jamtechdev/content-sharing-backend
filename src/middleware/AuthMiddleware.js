// middlewares/authenticate.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticate = (req, res, next) => {
  const token = req.header("authorization")?.split(" ")[1];
  console.log(token);
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }
  console.log(token, process.env.JWT_SECRET);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(decoded)
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = decoded;
    next();
  });
};

module.exports = authenticate;
