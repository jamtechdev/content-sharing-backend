const Router = require("../../decorators/Router");
const db = require("../../models/index.js");
const ProfileService = require("../../services/ProfileService.js");
const { cloudinaryImageUpload } = require("../../utils/cloudinaryService.js");
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const TryCatch = require("../../decorators/TryCatch.js");
const { upload } = require("../../utils/MulterConfig.js");
const UserService = require("../../services/UserService.js");
const User = db.users;
const Region = db.Regions;
const Profile = db.model_profile;
const Content = db.contents;

class ModelProfileController {
  constructor() {
    this.router = new Router();
    // Using TryCatch to wrap async controller functions
    this.router.addRoute(
      "post",
      "/create-modal-profile",
      authenticate,
      TryCatch(this.createModalProfile.bind(this))
    );
    // this.router.addRoute(
    //   "get",
    //   "/get-model-profile",
    //   authenticate,
    //   authorize(["model"]),
    //   TryCatch(this.getModelProfile.bind(this))
    // );

  }

  async createModalProfile(req, res) {
    const user = req?.user;
    const formData = req?.body;
    const createModalProfile = await ProfileService.createModalProfile(
      user?.userId,
      formData
    );

    return res.status(200).json({
      code: 200,
      message: "Modal profile created successfully",
    });
  }

  // async getModelProfile(req, res) {
  //   const user = req?.user;
  //   const getModelProfileData = await ProfileService.getProfileByUserId(
  //     user?.userId
  //   );

  //   return res.status(200).json({
  //     code: 200,
  //     data: getModelProfileData,
  //   });
  // }

  // modal photo_url and cover_url



  getRouter() {
    return this.router.getRouter();
  }
}

module.exports = new ModelProfileController();
