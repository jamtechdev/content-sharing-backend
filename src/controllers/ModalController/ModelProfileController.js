require("dotenv").config();
const db = require("../../models/index.js");
const ProfileService = require("../../services/ProfileService.js");
const { cloudinaryImageUpload } = require("../../utils/cloudinaryService.js");
const User = db.users;
const Region = db.Regions;
const Profile = db.model_profile;
const Content = db.contents;

class ModelProfileController {
  constructor() {
    

  }

  async getModelProfile(req, res) {
    const user = req?.user;
    const getModelProfileData = await ProfileService.getProfileByUserId(
      user?.userId
    );
  }
}

module.exports = new ModelProfileController();
