const db = require("../models/index.js");
const Region = db.Regions;

class RegionRepository {
  async getRegions() {
    return await Region.findAll({
      attributes: ["id", "name","country_code","code"],});
  }
}

module.exports = new RegionRepository();
