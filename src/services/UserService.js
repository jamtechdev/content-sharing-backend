const HttpError = require("../decorators/HttpError");
const UserRepository = require("../repositories/UserRepository");

class userService {
  async getUserById(id) {
    // Here check
    const getUserData = await UserRepository.getUserById(id);

    if (!getUserData) {
      throw new HttpError(404, "User not found");
    }

    return getUserData;
  }

  async updateUserAvatar(id, avatar) {
    const updateUserData = await UserRepository.updateUserAvatar(id, avatar);
    const updatedUser = await UserRepository.findById(id);

    if (!updateUserData) {
      throw new HttpError(404, "User not found");
    }

    return updatedUser;
  }

  async updateUserbyId(id, query) {
    const updateUser = await UserRepository.updateUserById(id, query);
    if (!updateUser) {
      throw new HttpError(400, "User not found");
    }
    return updateUser;
  }

  async getUsersByRole(role){
    return await UserRepository.getUsersByRole(role)
  }
}

module.exports = new userService(UserRepository);
