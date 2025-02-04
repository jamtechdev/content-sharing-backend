const db = require("../models/index.js");
const { cloudinaryImageUpload } = require("../utils/cloudinaryService.js");
const User = db.users;
const Region = db.Regions;
const ModelProfile = db.ModelProfile;
// const Content = db.contents

class ProfileRepository {
  async updateProfile(id, data) {
    return await ModelProfile.update(data, { where: { user_id: id } });
  }
  async getProfile(id) {
    return await ModelProfile.findOne({ where: { user_id: id } });
  }
  async findProfileById(id) {
    return await ModelProfile.findOne({ where: { user_id: id } });
  }
}

module.exports = new ProfileRepository();
