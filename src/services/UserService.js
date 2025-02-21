const HttpError = require("../decorators/HttpError");
const UserRepository = require("../repositories/UserRepository");

class userService {
  async getUserById(id) {
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
    console.log(id, query);

    const updateUser = await UserRepository.updateUserById(id, query);
    if (!updateUser) {
      throw new HttpError(400, "User not found");
    }
    return updateUser;
  }
}

module.exports = new userService(UserRepository);