const db = require("../models/index.js");
const User = db.users;

class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ where: { email }, attributes: ["id", "name", "email", "password", "avatar", "region_id", "role_id", "access_token", "platform_type"],
      include: [
        {
          model: db.Regions,
          as: "region",
          attributes: ["name"],
        },
        {
          model: db.Roles,
          as: "role",
          attributes: ["name", "guard_name"],
        },
      ], });
  }

  async findById(id) {
    return await User.findOne({ where: { id } });
  }

  async create(userData) {
    
    return await User.create(userData);
  }

  async updatePassword(id, newPassword , email) {
    return await User.update({ password: newPassword }, { where: { id, email } });
  }
  async resetPassword(id, email) {    
    return await User.findOne({ where: { id ,email },
      include: [
        {
          model: db.Roles,
          as: "role",
          attributes: ["name", "guard_name"],
        },
      ],
    });
  }
}

module.exports = new UserRepository();
