const express = require("express");
const AuthController = require("../controllers/User/AuthController");
const UserController = require("../controllers/User/UserController");
const ModelProfileController = require("../controllers/ModalController/ModelProfileController");
const ContentController = require("../controllers/ContentController/ContentController");
const BookmarkController = require("../controllers/BookmarkController/BookmarkController");

const router = express.Router();
router.use("/auth", AuthController.getRouter());
router.use("/profile", UserController.getRouter());
router.use("/model", ModelProfileController.getRouter());
router.use("/content", ContentController.getRouter());
router.use("/bookmarks", BookmarkController.getRouter());

module.exports = router;
