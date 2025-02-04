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
    console.log(id, ">--------------<");
    return await ModelProfile.findOne({
      where: { user_id: id },
      include: [
        {
          model: User,
          as: "user",
          attributes: [
            "id",
            "name",
            "email",
            "address",
            "phone_number",
            "birthdate",
          ],
        },
        {
          model: Region,
          as: "region",
          attributes: ["name"],
        },
      ],
      raw: true,
      nest: false,
    });
  }

  async findByUsername(username) {
    return ModelProfile.findOne({ where: { username } });
  }

  async createProfile(profileData) {
    console.log(profileData);
    return ModelProfile.create(profileData);
  }

  async updateModelProfileAndCoverPhoto(id, imageUri, data) {
    // console.log(data,imageUri,id);
    if (data) {
      return await ModelProfile.update(
        { profile_picture: imageUri },
        { where: { user_id: id } }
      );
    } else {
      return await ModelProfile.update(
        { cover_photo: imageUri },
        { where: { user_id: id } }
      );
    }
  }
}

module.exports = new ProfileRepository();
