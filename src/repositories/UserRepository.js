const { where } = require("sequelize");
const db = require("../models/index.js");
const { cloudinaryImageUpload } = require("../utils/cloudinaryService.js");
const { Op } = require("sequelize");
const User = db.users;

class UserRepository {
  async findByEmail(email) {
    return await User.findOne({
      where: { email },
      attributes: [
        "id",
        "name",
        "email",
        "password",
        "avatar",
        "cover_photo",
        "address",
        "phone_number",
        "birthdate",
        "bio",
        "region_id",
        "role_id",
        "access_token",
        "platform_type",
      ],
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
      ],
    });
  }
  async findById(id) {
    return await User.findOne({
      where: { id },
      attributes: [
        "id",
        "name",
        "email",
        "avatar",
        "region_id",
        "role_id",
        "platform_type",
        "address",
        "phone_number",
        "birthdate",
        "social_links",
        "bio",
      ],
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
      ],
      raw: true,
      nest: false,
    });
  }
  async create(userData) {
    return await User.create(userData);
  }

  async updatePassword(id, newPassword, email) {
    return await User.update(
      { password: newPassword },
      { where: { id, email } }
    );
  }
  async resetPassword(id, email) {
    return await User.findOne({
      where: { id, email },
      include: [
        {
          model: db.Roles,
          as: "role",
          attributes: ["name", "guard_name"],
        },
      ],
    });
  }
  // get user by id
  async getUserById(id) {
    return await User.findOne({
      where: { id },
      attributes: [
        "id",
        "name",
        "email",
        "avatar",
        "cover_photo",
        "address",
        "phone_number",
        "birthdate",
        "social_links",
        "bio",
        "region_id",
      ],
      include: [
        {
          model: db.Regions,
          as: "region",
          attributes: [["name", "regionName"]],
        },
        {
          model: db.Roles,
          as: "role",
          attributes: [["name", "roleName"]],
        },
      ],
      raw: true,
      nest: true,
    });
  }
  async updateUserAvatar(id, avatar) {
    console.log(id, avatar);
    const uploadedAvatar = await cloudinaryImageUpload(avatar?.path, "");
    if (uploadedAvatar?.error) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: uploadedAvatar?.error,
      });
    }
    return await User.update(
      { avatar: uploadedAvatar.secureUrl },
      { where: { id: id } }
    );
  }

  async updateUserById(id, query) {
    return await User.update(query, {
      where: {
        id: id,
      },
    });
  }

  async getUsersByRole(role) {
    return await User.findAll({ where: { role_id: role }, limit: 3 });
  }
}

module.exports = new UserRepository();
