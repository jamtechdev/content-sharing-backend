const TryCatch = require("../../decorators/TryCatch");
const Router = require("../../decorators/Router");
const jwt = require("jsonwebtoken");
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const RegionService = require("../../services/RegionService");

class RegionController {
  constructor() {
    this.router = new Router();
    // Using TryCatch to wrap async controller functions
    this.router.addRoute(
      "get",
      "/get-region",
      TryCatch(this.getRegion.bind(this))
    );
  }
  async getRegion(req, res) {
    const regionData = await RegionService.getRegions();
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Region fetched successfully",
      data:regionData
    });
  }
  getRouter() {
    return this.router.getRouter();
  }
}

module.exports = new RegionController();
