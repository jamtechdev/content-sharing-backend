const HttpError = require("../decorators/HttpError");
const RegionRepository = require("../repositories/RegionRepository");

class RegionService {
  async getRegions() {
    return await RegionRepository.getRegions();
  }
}

module.exports = new RegionService();
