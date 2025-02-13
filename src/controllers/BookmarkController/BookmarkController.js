const Router = require("../../decorators/Router");
const db = require("../../models/index.js");
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const TryCatch = require("../../decorators/TryCatch.js");
const ContentService = require("../../services/ContentService.js");
const BookmarkService = require("../../services/BookmarkService.js");

class BookmarkController {
  constructor() {
    this.router = new Router();
    // Using TryCatch to wrap async controller functions
    this.router.addRoute(
      "post",
      "/",
      authenticate,
      authorize(["user","modal"]),
      TryCatch(this.addBookmarks.bind(this))
    );
    this.router.addRoute(
      "get",
      "/",
      authenticate,
      authorize(["user","modal"]),
      TryCatch(this.getBookmarkByUser.bind(this))
    );
    this.router.addRoute(
      "delete",
      "/:id",
      authenticate,
      authorize(["user","modal"]),
      TryCatch(this.removeBookmark.bind(this))
    );
  }

  async addBookmarks(req, res) {
    const { content_id } = req?.body;
    const { userId } = req?.user;
    const data = {
      content_id: content_id,
      user_id: userId,
    };

    const exitingbookmark = await BookmarkService.getBookmark(data);
    if (exitingbookmark) {
      return res.status(409).json({
        code: 409,
        success: false,
        message: "Already bookmarked.",
      });
    }

    const response = await BookmarkService.addBookmark(data);
    return res.status(201).json({
      code: 201,
      success: true,
      message: "Content Bookmarked.",
    });
  }

  async getBookmarkByUser(req, res){
    const { userId } = req?.user;

    const response = await BookmarkService.getBookmarkbyUser(userId)
    return res.status(200).json({
        code: 200,
        success: true,
        data:response
      });
  }

  async removeBookmark(req, res){
    const {id} = req?.params
    const response = await BookmarkService.removeBookmark(id)
    return res.status(200).json({
        code: 200,
        success: true,
        message :"Bookmark removed"
      });
  }
  getRouter() {
    return this.router.getRouter();
  }
}

module.exports = new BookmarkController();
