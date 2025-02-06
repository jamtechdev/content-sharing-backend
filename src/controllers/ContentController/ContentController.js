const Router = require("../../decorators/Router");
const db = require("../../models/index.js");
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const TryCatch = require("../../decorators/TryCatch.js");
const { upload } = require("../../utils/MulterConfig.js");
const { cloudinaryImageUpload } = require("../../utils/cloudinaryService.js");
const ContentService = require("../../services/ContentService.js");
const UserService = require("../../services/UserService.js");

class ContentController {
  constructor() {
    this.router = new Router();
    // Using TryCatch to wrap async controller functions
    this.router.addRoute(
      "post",
      "/create-content",
      authenticate,
      authorize(["model"]),
      upload.single("mediaFile"),
      TryCatch(this.createContent.bind(this))
    );
    this.router.addRoute(
      "get",
      "/get-content",
      authenticate,
      authorize(["user", "model"]),
      TryCatch(this.getContent.bind(this))
    );
    this.router.addRoute(
      "get",
      "/get-content-by-id",
      authenticate,
      authorize(["model"]),
      TryCatch(this.getContentByModelId.bind(this))
    );
    this.router.addRoute(
      "put",
      "/update-content",
      authenticate,
      authorize(["model"]),
      upload.single("mediaFile"),
      TryCatch(this.updateContent.bind(this))
    );
    this.router.addRoute(
      "delete",
      "/delete-content",
      authenticate,
      authorize(["model"]),
      TryCatch(this.deleteContent.bind(this))
    );
  }

  async createContent(req, res) {
    const { userId } = req?.user;
    const mediaFile = req?.file;
    const {
      title,
      description,
      category_id,
      region_id: modal_region_id,
    } = req.body;
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "Data is required to create content",
      });
    }
    const { region_id } = await UserService.getUserById(userId);
    const mediaFileUrl = await cloudinaryImageUpload(mediaFile.path);
    const data = {
      title,
      description,
      content_type: mediaFileUrl.resourceType,
      category_id,
      user_id: userId,
      // region_id: modal_region_id ?? JSON.stringify([region_id]),
      region_id: modal_region_id ?? JSON.stringify([1, 2, 3, 4, 5, 6, 7]),
      media_url: mediaFileUrl.secureUrl,
    };
    const response = await ContentService.createContent(data);
    return res.status(201).json({
      code: 201,
      success: true,
      message: "Content created successfully",
      data: response,
    });
  }

  async getContent(req, res) {
    const { userId } = req?.user;
    const { region_id } = await UserService.getUserById(userId);
    const response = await ContentService.getContent(region_id);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Content fetched successfully",
      data: response,
    });
  }

  async updateContent(req, res) {
    const { userId } = req?.user;
    const mediaFile = req.file;
    const {
      status,
      title,
      description,
      content_type,
      category_id,
      contentId,
      region_id,
    } = req?.body;
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "Data fields required to update content",
      });
    }
    const content = await ContentService.findById(contentId, userId);
    let mediaFileUrl;
    if (mediaFile) {
      mediaFileUrl = await cloudinaryImageUpload(mediaFile?.path);
    }
    const response = await ContentService.updateContent(
      {
        status,
        title,
        description,
        content_type: mediaFile
          ? mediaFileUrl.resourceType
          : content.content_type,
        category_id,
        media_url: mediaFile ? mediaFileUrl.secureUrl : content.media_url,
        contentId,
        region_id,
      },
      userId
    );

    return res.status(200).json({
      code: 200,
      success: true,
      message: "Content updated successfully",
    });
  }

  async deleteContent(req, res) {
    const { contentId } = req.body;
    if (!contentId) {
      return res
        .status(400)
        .json({ code: 400, success: false, message: "Content id is required" });
    }
    await ContentService.findById(contentId);
    await ContentService.deleteContent(contentId);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Content removed successfully",
    });
  }

  // get content by modelId
  async getContentByModelId(req, res) {
    const { userId } = req?.user;
    const response = await ContentService.findAllContentById(userId);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Content fetched successfully",
      data: response,
    });
  }

  getRouter() {
    return this.router.getRouter();
  }
}

module.exports = new ContentController();
