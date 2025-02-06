const AuthService = require("../../services/AuthService");
const TryCatch = require("../../decorators/TryCatch");
const Router = require("../../decorators/Router");
const jwt = require("jsonwebtoken");
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const UserService = require("../../services/UserService");
const { upload } = require("../../utils/MulterConfig");
const ProfileService = require("../../services/ProfileService");

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
      "post",
      "/upload-avatar",
      authenticate,
      authorize(["user", "model"]),
      upload.single("avatar"),
      TryCatch(this.uploadAvatar.bind(this))
    );
    this.router.addRoute(
      "put",
      "/my-profile-update",
      authenticate,
      authorize(["user", "model"]),
      TryCatch(this.updateUser.bind(this))
    );
  }
  //   get-user-profile
  async me(req, res) {
    const user = req?.user;
    console.log(user);
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

      return res.status(200).json({
        code: 200,
        data: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          profile_picture: newUser.avatar,
          address: newUser.address,
          phone_number: newUser.phone_number,
          birthdate: newUser.birthdate,
          social: newUser.social,
          bio: newUser.bio,
          platform_type: newUser.platform_type,
          region: newUser.region?.regionName,
          role: newUser.role?.roleName,
        },
      });
    }
  }
  //   update-user-profile
  async uploadAvatar(req, res) {
    const user = req?.user;
    const avatar = req?.file;
    console.log(avatar);

    if (!avatar) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "No file uploaded",
      });
    }
    await UserService.getUserById(user?.userId);
    const updateUser = await UserService.updateUserAvatar(user?.userId, avatar);

    return res.status(200).json({
      code: 200,
      data: updateUser,
    });
  }
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
  getRouter() {
    return this.router.getRouter();
  }
}

module.exports = new UserController();
