const Router = require("../../decorators/Router");
const db = require("../../models/index.js");
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const TryCatch = require("../../decorators/TryCatch.js");
const { upload } = require("../../utils/MulterConfig.js");

class ContentController {
  constructor() {
    this.router = new Router();
    // Using TryCatch to wrap async controller functions
    this.router.addRoute(
      "post",
      "/create-content",
      authenticate,
      authorize(["model"]),
      upload.single("image"),
      TryCatch(this.createContent.bind(this))
    );
    this.router.addRoute(
      "get",
      "/get-content",
      authenticate,
      authorize(["model"]),
      TryCatch(this.getContent.bind(this))
    );
    this.router.addRoute(
      "put",
      "/update-content",
      authenticate,
      authorize(["model"]),
      upload.single("image"),
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






  
}

module.exports = ContentController;
