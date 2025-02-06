const HttpError = require("../decorators/HttpError");
const ProfileRepository = require("../repositories/ProfileRepository");
const { cloudinaryImageUpload } = require("../utils/cloudinaryService");

class ProfileService {
  async updateProfile(id, data) {
    const profile = await ProfileRepository.updateProfile(id, data);
    if (!profile) {
      throw new HttpError(404, "Profile not found");
    }
    return profile;
  }
  async getProfile(id) {
    const profile = await ProfileRepository.getProfile(id);
    if (!profile) {
      throw new HttpError(404, "Profile not found");
    }
    return profile;
  }

  async createModalProfile(user, profileData) {
    console.log(user, "userId-------------->");
    // Check if a profile already exists for the user.
    const existingProfile = await ProfileRepository.findProfileById(user);
    if (existingProfile) {
      throw new HttpError(400, "Profile already exists");
      //   const error = new Error("Profile already exists");
      //   error.statusCode = 400;
      //   throw error;
    }
    const existingUsername = await ProfileRepository.findByUsername(
      profileData.username
    );
    console.log(existingUsername);
    if (existingUsername) {
      throw new HttpError(400, "Username already exists");
    }
    const newProfile = await ProfileRepository.createProfile({
      ...profileData,
      user_id: user,
      content_visibility: "all",
    });

    if (!newProfile) {
      const error = new Error("Profile not created");
      error.statusCode = 400;
      throw error;
    }

    return newProfile;
  }

  async getProfileByUserId(id) {
    const profile = await ProfileRepository.findProfileById(id);
    if (!profile) {
      throw new HttpError(404, "Profile not found");
    }
    return profile;
  }

  async updateModalProfileById(id, formdata) {
    const profile = await ProfileRepository.updateProfile(id, formdata);
    if (!profile) {
      throw new HttpError(404, "Profile not found");
    }
    return profile;
  }

  async uploadModalPhoto(id, file, formData) {
    const modalProfile = await ProfileRepository.findProfileById(id);
    if (!modalProfile) {
      throw new HttpError(404, "Profile not found");
    }
    const imageUri = await cloudinaryImageUpload(file.path, "image");
    const updateField = formData.profile_picture
      ?  true
      : false;
    console.log(imageUri);

    const profile = await ProfileRepository.updateModelProfileAndCoverPhoto(
      id,
      imageUri.secureUrl,
      updateField
    );
    if (!profile) {
      throw new HttpError(404, "Profile not found");
    }
    return profile;
  }
}

module.exports = new ProfileService();
