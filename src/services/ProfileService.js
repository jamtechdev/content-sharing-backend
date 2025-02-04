const HttpError = require("../decorators/HttpError");
const ProfileRepository = require("../repositories/ProfileRepository");

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
  async getProfileByUserId(id) {
    const profile = await ProfileRepository.findProfileById(id);
    if (!profile) {
      throw new HttpError(404, "Profile not found");
    }
    return profile;
  }
}

module.exports = new ProfileService();
