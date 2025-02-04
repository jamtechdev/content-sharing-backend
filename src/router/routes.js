const express = require("express");
const AuthController = require("../controllers/User/AuthController");
const UserController = require("../controllers/User/UserController");

const router = express.Router();
router.use("/auth", AuthController.getRouter());
router.use("/profile", UserController.getRouter());


module.exports = router;
