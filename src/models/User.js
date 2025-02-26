"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Associate User with Region using "region_id" without foreign key constraint
      User.belongsTo(models.Regions, {
        foreignKey: "region_id",
        as: "region",
      });
      // Associate User with Role using "role_id" without foreign key constraint
      User.belongsTo(models.Roles, {
        foreignKey: "role_id",
        as: "role",
      });
      User.hasOne(models.ModelProfile, {
        foreignKey: "user_id",
        as: "model_profiles",
      });

      User.hasOne(models.Content, {
        foreignKey: "user_id",
        as: "user",
      });
      User.hasOne(models.Subscription, {
        foreignKey: "id",
        as: "subscriber",
      });
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        lowercase: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email_verified_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        // set(value) {
        //   const salt = bcrypt.genSaltSync(10);
        //   const hashedPassword = bcrypt.hashSync(value, salt);
        //   this.setDataValue("password", hashedPassword);
        // },
        // get() {
        //   return () => this.getDataValue("password");
        // },
      },
      is_blocked_by_platform: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      access_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      platform_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      birthdate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      social_links: {
        type: DataTypes.JSON, // Storing social media links as JSON
        allowNull: true,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      region_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      cover_photo: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW(),
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW(),
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "users",
      tableName: "users",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return User;
};
