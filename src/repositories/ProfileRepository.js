const db = require("../models/index.js");
const { cloudinaryImageUpload } = require("../utils/cloudinaryService.js");
const User = db.users;
const Region = db.Regions;
const ModelProfile = db.ModelProfile;
const Subscription = db.Subscription;
// const Content = db.contents

class ProfileRepository {
  async updateProfile(id, data) {
    return await ModelProfile.update(data, { where: { user_id: id } });
  }
  async getProfile(id) {
    return await ModelProfile.findOne({ where: { user_id: id } });
  }
  async findProfileById(id) {
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
            "bio",
            "avatar",
            "cover_photo",
          ],
          include: [
            {
              model: db.Roles,
              as: "role",
              attributes: ["name", "guard_name"],
            },
          ],
        },
        {
          model: Region,
          as: "region",
          attributes: ["name"],
        },
        {
          model: Subscription,
          as: "subscription",
          // attributes: ["id", "name"],
        },
      ],
    });
  }

  async findByUsername(username) {
    return ModelProfile.findOne({ where: { username } });
  }

  async createProfile(profileData) {
    console.log(profileData);
    return ModelProfile.create(profileData);
  }

  async updateModelProfileAndCoverPhoto(user, imageUri, data) {
    // console.log(data,imageUri,id);

    if (data) {
      await User.update(
        {
          avatar: imageUri,
        },
        { where: { id: user.userId } }
      );
      return imageUri;
    } else {
      console.log("User's else condition");
      await User.update(
        {
          cover_photo: imageUri,
        },
        { where: { id: user.userId } }
      );
      return imageUri;
    }
  }
}

module.exports = new ProfileRepository();
