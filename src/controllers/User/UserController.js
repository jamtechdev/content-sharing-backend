const AuthService = require("../../services/AuthService");
const TryCatch = require("../../decorators/TryCatch");
const Router = require("../../decorators/Router");
const jwt = require("jsonwebtoken");
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const UserService = require("../../services/UserService");
const { upload } = require("../../utils/MulterConfig");
const ProfileService = require("../../services/ProfileService");
const { calculateTimeLeft } = require("../../utils/dateUtils");
const SubscriptionRepository = require('../../repositories/SubscriptionRepository')

class UserController {
  constructor() {
    this.router = new Router();
    // Using TryCatch to wrap async controller functions
    this.router.addRoute(
      "get",
      "/get-my-profile",
      authenticate,
      authorize(["user", "model"]),
      TryCatch(this.me.bind(this))
    );
    this.router.addRoute(
      "put",
      "/my-profile-update",
      authenticate,
      authorize(["user", "model"]),
      TryCatch(this.updateUser.bind(this))
    );
    this.router.addRoute(
      "put",
      "/update-profile",
      authenticate,
      authorize(["user", "model"]),
      TryCatch(this.updateProfile.bind(this))
    );
    this.router.addRoute(
      "post",
      "/upload-modal-asset",
      authenticate,
      authorize(["user", "model"]),
      upload.single("image"),
      TryCatch(this.uploadAsset.bind(this))
    );
    this.router.addRoute(
      "get",
      "/get-user-by-role",
      authenticate,
      authorize(["user", "model"]),
      TryCatch(this.getUsersByRole.bind(this))
    )

    this.router.addRoute(
      "put",
      "/user/block-unblock",
      authenticate,
      authorize(["model"]),
      TryCatch(this.blockUnblockUser.bind(this))
    )

    this.router.addRoute(
      'get',
      "/user/:id",
      authenticate,
      authorize(["model"]),
      TryCatch(this.getUserDetailById.bind(this))
    )
  }
  //   get-user-profile
  async me(req, res) {
    const user = req?.user;

    // console.log(user);
    if (user.role === "model") {
      const getModelProfileData = await ProfileService.getProfileByUserId(
        user?.userId
      );
      return res.status(200).json({
        code: 200,
        data: getModelProfileData,
      });
    } else {
      const newUser = await UserService.getUserById(user?.userId);
      const subscription = await SubscriptionRepository.getByUser(user?.userId)
      return res.status(200).json({
        code: 200,
        data: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          avatar: newUser.avatar,
          cover_photo: newUser.cover_photo,
          address: newUser.address,
          phone_number: newUser.phone_number,
          birthdate: newUser.birthdate,
          social: newUser.social,
          bio: newUser.bio,
          platform_type: newUser.platform_type,
          region_id: newUser.region_id,
          region: newUser.region.toJSON()?.regionName,
          role: newUser.role.toJSON()?.roleName,
          // region: newUser.region?.regionName,  // earlier was this 
          // role: newUser.role?.roleName,
          plan_id: newUser.subscriber?.plan_id || null,
          plan_start: newUser.subscriber?.status || null,
          plan: newUser.subscriber?.plan?.name || null,
          plan_expire: calculateTimeLeft(newUser.subscriber?.end_date) || null,
          coins: subscription?.coins,
          premium_content: newUser.premium_content || []
        },
      });
    }
  }
  //   update-user-profile
  async uploadAsset(req, res) {
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

  // need to remove this
  async updateUser(req, res) {
    const user = req?.user;
    const formData = req.body;

    const response = await UserService.updateUserbyId(user?.userId, formData);
    console.log(response);

    if (response[0] === 0) {
      return res.status(404).json({
        error: true,
        message: "Id not found in table!",
      });
    }

    return res.status(200).json({
      code: 200,
      message: "User details updated successfully.",
    });
  }

  async updateProfile(req, res) {
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
      "region_id",
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
      message: "profile updated successfully",
    });
  }

  async getUsersByRole(req, res) {
    const user = req?.user;
    console.log(user,"user----------------")
    const response = await UserService.getUsersByRole(user.role =="model" ? 3 :2);
    return res.status(200).json({
      status:true,
      code:200,
      message:"Data fetched successfully.",
      data: response
    })
  }

  async blockUnblockUser(req, res){
    const {id, isBlocked} = req.body;
    const response = await UserService.updateUserbyId(id, {is_blocked_by_platform: isBlocked})
    return res.status(200).json({
      code: 200,
      success: true, 
      message: `User ${isBlocked === true? 'blocked' : "unblocked"} successfully`
    })
  }
  getRouter() {
    return this.router.getRouter();
  }

  async getUserDetailById(req, res){
    const {id} = req?.params;
    const response = await UserService.getUserById(id);
    return res.status(200).json({
      code: 200,
      success: true, 
      data: response
    })
  }
}

module.exports = new UserController();
