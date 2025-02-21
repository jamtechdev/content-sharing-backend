const express = require("express");
const AuthController = require("../controllers/User/AuthController");
const UserController = require("../controllers/User/UserController");
const ModelProfileController = require("../controllers/ModalController/ModelProfileController");
const PlanController = require("../controllers/PlanController/PlanController");
const SubscriptionController = require("../controllers/SubscriptionController/SubscriptionController");
const ContentController = require("../controllers/ContentController/ContentController");
const BookmarkController = require("../controllers/BookmarkController/BookmarkController");
const regionController = require("../controllers/RegionController/regionController");
const ProductController = require("../controllers/ProductController/ProductController");
const ProductCategoryController = require("../controllers/ProductController/ProductCategoryController");
const ProductMediaController = require("../controllers/ProductController/ProductMediaController");
const ProductAttributeController = require("../controllers/ProductController/ProductAttributeController");
const ProductDiscountController = require("../controllers/ProductController/ProductDiscountController");
const ProductOfferController = require("../controllers/ProductController/ProductOfferController");
const ProductCouponController = require("../controllers/ProductController/ProductCouponController");
const ProductWithCouponController = require("../controllers/ProductController/ProductWithCouponController");
const UserCoupon = require("../controllers/ProductController/UserCouponController");
const ProductOrderController = require("../controllers/ProductController/ProductOrderController");
const MessageController = require('../controllers/MessageController/MessageController')

const router = express.Router();

router.use("/auth", AuthController.getRouter());
router.use("/profile", UserController.getRouter());
router.use("/plan", PlanController.getRouter());
router.use("/subscription", SubscriptionController.getRouter());
router.use("/model", ModelProfileController.getRouter());
router.use("/content", ContentController.getRouter());
router.use("/bookmarks", BookmarkController.getRouter());
router.use("/model", ModelProfileController.getRouter());
router.use("/region", regionController.getRouter());
// ----------------------> Product Routes <----------------------
router.use("/product", ProductController.getRouter());
router.use("/category", ProductCategoryController.getRouter());
router.use("/attribute", ProductAttributeController.getRouter());
router.use("/media", ProductMediaController.getRouter());
router.use("/discount", ProductDiscountController.getRouter());
router.use("/offer", ProductOfferController.getRouter());
router.use("/coupon", ProductCouponController.getRouter());
router.use("/product-with-coupon", ProductWithCouponController.getRouter());
router.use("/user-coupon", UserCoupon.getRouter());
router.use("/order", ProductOrderController.getRouter());

router.use('/message', MessageController.getRouter())

module.exports = router;
