const express = require("express");
const AuthController = require("../controllers/User/AuthController");

const router = express.Router();
router.use("/auth", AuthController.getRouter());


module.exports = router;
