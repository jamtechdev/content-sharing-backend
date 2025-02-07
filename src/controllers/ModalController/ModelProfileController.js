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
    this.router.addRoute(
      "get",
      "/get-model-profile",
      authenticate,
      authorize(["model"]),
      TryCatch(this.getModelProfile.bind(this))
    );
    this.router.addRoute(
      "put",
      "/update-profile",
      authenticate,
      authorize(["model"]),
      TryCatch(this.updateModelProfile.bind(this))
    );
    this.router.addRoute(
      "post",
      "/upload-modal-asset",
      authenticate,
      authorize(["user", "model"]),
      upload.single("image"),
      TryCatch(this.uploadModalAsset.bind(this))
    );
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

  async getModelProfile(req, res) {
    const user = req?.user;
    const getModelProfileData = await ProfileService.getProfileByUserId(
      user?.userId
    );

    return res.status(200).json({
      code: 200,
      data: getModelProfileData,
    });
  }

  async updateModelProfile(req, res) {
    const user = req?.user;
    const formData = req?.body;
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "Data fields required to update modal profile",
      });
    }

    // check some fields for updating a user table
    const allowedFields = [
      "name",
      "address",
      "phone_number",
      "birthdate",
      "bio",
    ];
    const updateUserData = Object.fromEntries(
      Object.entries(formData).filter(
        ([key, value]) => allowedFields.includes(key) && value?.trim()
      )
    );
    if (Object.keys(updateUserData).length) {
      await UserService.updateUserbyId(user?.userId, updateUserData);
    }

    const updateModalProfile = await ProfileService.updateModalProfileById(
      user?.userId,
      formData
    );

    return res.status(200).json({
      code: 200,
      message: "Modal profile updated successfully",
    });
  }

  // modal photo_url and cover_url

  async uploadModalAsset(req, res) {
    const { user, file, body } = req;
    if (!file) {
      return res
        .status(400)
        .json({ code: 400, success: false, message: "No image uploaded" });
    }
    const fileExt = ["image/jpg", "image/jpeg", "image/png", "image/webp"];
    if (!fileExt.includes(file.mimetype)) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "Supported file formats: .jpg, .jpeg, .png, .webp,",
      });
    }

    const uploadModalPhoto = await ProfileService.uploadModalPhoto(
      user,
      file,
      body
    );
    return res.status(200).json({
      code: 200,
      message: "Modal photo uploaded successfully",
      data: uploadModalPhoto,
    });
  }

  getRouter() {
    return this.router.getRouter();
  }
}

module.exports = new ModelProfileController();
