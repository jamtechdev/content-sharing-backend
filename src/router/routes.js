const express = require("express");
const AuthController = require("../controllers/User/AuthController");
const UserController = require("../controllers/User/UserController");
const ModelProfileController = require("../controllers/ModalController/ModelProfileController");
const ContentController = require('../controllers/ContentController/ContentController')
const PlanController = require('../controllers/PlanController/PlanController')
const SubscriptionController = require('../controllers/SubscriptionController/SubscriptionController')

const router = express.Router();
router.use("/auth", AuthController.getRouter());
router.use("/profile", UserController.getRouter());
router.use("/model",ModelProfileController.getRouter())
router.use("/content", ContentController.getRouter())
router.use('/plan', PlanController.getRouter())
router.use('/subscription', SubscriptionController.getRouter())


module.exports = router;
