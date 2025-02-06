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

  async updateModelProfileAndCoverPhoto(user, imageUri, data) {
    // console.log(data,imageUri,id);
    console.log("Recieve data in repo==>", user, imageUri, data)
    if(user.role === "user"){
      if(data){
        console.log("User's if condition")
        await User.update({
          avatar: imageUri}, 
          {where: {id: user.userId}
        })
        return imageUri
      }
      else {
        console.log("User's else condition")
        await User.update({
          cover_photo: imageUri},
          {where: {id: user.userId}
        })
        return imageUri
      }
    }
    else {
      if (data) {
        await ModelProfile.update(
          { profile_picture: imageUri },
          { where: { user_id: user.userId } }
        );
        return imageUri
      } else {
        await ModelProfile.update(
          { cover_photo: imageUri },
          { where: { user_id: user.userId } }
        );
        return imageUri
      }
    }
  }
}

module.exports = new ProfileRepository();