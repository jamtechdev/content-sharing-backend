const Router = require("../../decorators/Router");
const db = require("../../models/index.js");
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const TryCatch = require("../../decorators/TryCatch.js");
const { upload } = require("../../utils/MulterConfig.js");
const { cloudinaryImageUpload } = require("../../utils/cloudinaryService.js");
const ContentService = require("../../services/ContentService.js");
const UserService = require("../../services/UserService.js");
const pushNotification = require("../../_helper/pushNotification.js");
const ProfileService = require("../../services/ProfileService.js");
const { uploadToS3 } = require("../../config/S3upload.js");

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
      "/delete-content/:id",
      authenticate,
      authorize(["model"]),
      TryCatch(this.deleteContent.bind(this))
    );

    this.router.addRoute(
      "post",
      "/like-content",
      authenticate,
      authorize(["user", "model"]),
      TryCatch(this.contentLike.bind(this))
    );

    this.router.addRoute(
      "get",
      "/get-like-by-user",
      authenticate,
      authorize(["user", "model"]),
      TryCatch(this.getLikeByUserId.bind(this))
    );

    this.router.addRoute(
      "post",
      "/get-like-by-content",

      TryCatch(this.getLikeByContentId.bind(this))
    );

    this.router.addRoute(
      "post",
      "/comment",
      authenticate,
      authorize(["user", "model"]),
      TryCatch(this.addComment.bind(this))
    );

    this.router.addRoute(
      "get",
      "/comment",
      authenticate,
      authorize(["user", "model"]),
      TryCatch(this.getComment.bind(this))
    );
    this.router.addRoute(
      "get",
      "/comment/:id",
      authenticate,
      authorize(["user", "model"]),
      TryCatch(this.getCommentById.bind(this))
    );
    this.router.addRoute(
      "get",
      "/comment/content/:id",
      authenticate,
      authorize(["user", "model"]),
      TryCatch(this.getCommentByContentId.bind(this))
    );
    this.router.addRoute(
      "delete",
      "/comment/:id",
      authenticate,
      authorize(["user", "model"]),
      TryCatch(this.deleteComment.bind(this))
    );
    this.router.addRoute(
      "put",
      "/comment",
      authenticate,
      authorize(["user",'model']),
      TryCatch(this.updateComment.bind(this))
    );
  }

  async createContent(req, res) {
    try {
      const { userId } = req?.user;
      const mediaFile = req?.file;
      const defaultRegion = "1,2,3,4,5,6,7";

      // Extract body params
      const {
        title,
        description,
        category_id,
        region_id: modal_region_id,
        premium_access,
        price,
      } = req.body;

      // Ensure region_id is correctly formatted as JSON array
      const region_id = JSON.stringify(
        modal_region_id
          ? modal_region_id.split(",").map(Number)
          : defaultRegion.split(",").map(Number)
      );
      const mediaFileUrl = await uploadToS3(mediaFile.path, req.file.filename);
      const data = {
        title,
        description,
        premium_access,
        price,
        content_type: mediaFileUrl.resourceType,
        category_id,
        user_id: userId,
        region_id,
        media_url: mediaFileUrl.secureUrl,
      };
      const getModelProfileData = await ProfileService.getProfileByUserId(
        userId
      );
      const response = await ContentService.createContent(data);

      const payload = {
        title: `Post Notification`,
        message: `${getModelProfileData?.user?.name} added post for you.`,
        sender_id: userId,
        type: "subscription",
        item_id: response?.id,
      };
      await pushNotification(payload);
      return res.status(201).json({
        code: 201,
        success: true,
        message: "Content created successfully",
        data: response,
      });
    } catch (error) {
      console.error("Error creating content:", error);
      return res.status(500).json({
        code: 500,
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }
  async getContent(req, res) {
    const { userId } = req?.user;

    if (req.user.role === "model") {
      const response = await ContentService.findAllContentById(userId);
      return res.status(200).json({
        code: 200,
        success: true,
        message: "Content fetched successfully",
        data: response,
      });
    } else {
      const { region_id, id } = await UserService.getUserById(userId);
      console.log(region_id, id);
      const response = await ContentService.getContent(region_id, id);
      return res.status(200).json({
        code: 200,
        success: true,
        message: "Content fetched successfully",
        data: response,
      });
    }
  }

  async updateContent(req, res) {
    const { userId } = req?.user;
    const mediaFile = req.file;
    const defaultRegion = "1,2,3,4,5,6,7";
    console.log(req.body, "update-----------------------------");
    const {
      status,
      title,
      description,
      content_type,
      category_id,
      contentId,
      region_id: modal_region_id,
      premium_access,
      price,
    } = req?.body;
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "Data fields required to update content",
      });
    }

    const region_id = JSON.stringify(
      modal_region_id
        ? modal_region_id.split(",").map(Number)
        : defaultRegion.split(",").map(Number)
    );

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
        premium_access,
        price,
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
    const { id } = req?.params;
    if (!id) {
      return res
        .status(400)
        .json({ code: 400, success: false, message: "Content id is required" });
    }
    await ContentService.deleteContent(id);
    console.log(id);
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

  async contentLike(req, res) {
    const { contentId } = req?.body;
    const { userId } = req?.user;
    const user = await UserService.getUserById(userId);
    const getContent = await ContentService.getContentById(contentId);
    const payload = {
      title: `Notification from ${getContent.user.name}`,
      message: `${user?.name} likes ${getContent.user.name}'s post.`,
      sender_id: userId,
      type: "like",
      item_id: contentId,
    };

    // await pushNotification(payload);
    if (!contentId && !userId) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "Content id and User id are required",
      });
    }
    const data = await ContentService.getLikeByContentUserId(contentId, userId);

    if (data) {
      await ContentService.updateLikeByUsercontentId({
        content_id: contentId,
        user_id: userId,
        is_like: data?.is_like ? 0 : 1,
      });
      if (data?.is_like != 1) {
        await pushNotification(payload);
      }

      return res.status(200).json({
        code: 200,
        success: true,
        message: `You ${data?.is_like ? "Unliked" : "Liked"} this Content`,
      });
    }
    await ContentService.addLike({ content_id: contentId, user_id: userId });
    return res.status(200).json({
      code: 200,
      success: true,
      message: "You liked this Content",
    });
  }

  async getLikeByUserId(req, res) {
    const { userId } = req?.user;
    const data = await ContentService.getLikeByUserId(userId);
    return res.status(200).json({
      code: 200,
      success: true,
      data: data,
    });
  }

  async getLikeByContentId(req, res) {
    const { contentId } = req?.body;
    const data = await ContentService.getLikeByContentId(contentId);
    return res.status(200).json({
      code: 200,
      success: true,
      data: data,
    });
  }

  async addComment(req, res) {
    const { userId } = req?.user;
    const data = req?.body;
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "Comment text is required to add comment",
      });
    }
    data["user_id"] = userId;
    const response = await ContentService.addComment(data);
    if (response) {
      const content = await ContentService.getCommentByContentId(
        data.content_id
      );

      const payload = {
        title: `Notification`,
        message: `${content[0].user?.name} commented on a post.`,
        sender_id: userId,
        type: "comment",
        item_id: data.content_id,
      };

      await pushNotification(payload);
      return res.status(201).json({
        code: 201,
        success: true,
        data: content,
      });
    } else {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "Something went wrong",
      });
    }
  }

  async getComment(req, res) {
    const response = await ContentService.getComment();
    return res.status(200).json({
      code: 200,
      success: true,
      data: response,
    });
  }

  async getCommentById(req, res) {
    const { id } = req?.params;
    const response = await ContentService.getCommentById(id);
    return res.status(200).json({
      code: 200,
      success: true,
      data: response,
    });
  }

  async getCommentByContentId(req, res) {
    const { id } = req?.params;
    const response = await ContentService.getCommentByContentId(id);
    return res.status(200).json({
      code: 200,
      success: true,
      data: response,
    });
  }

  async deleteComment(req, res) {
    const { id } = req?.params;
    const response = await ContentService.deleteCommentById(id);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Comment deleted successfully.",
    });
  }

  async updateComment(req, res) {
    const data = req?.body;

    const response = await ContentService.updateComment(data);
    if (!response) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "Something went wrong",
      });
    }

    if (response) {
      const { userId } = req?.user;
      const content = await ContentService.getCommentByUserId(userId);
      return res.status(201).json({
        code: 201,
        success: true,
        data: content,
      });
    } else {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "Something went wrong",
      });
    }
  }
  getRouter() {
    return this.router.getRouter();
  }
}

module.exports = new ContentController();
