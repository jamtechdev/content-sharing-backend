"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ModelProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.users, {
        foreignKey: "user_id",
        as: "user",
        // onDelete: "CASCADE",
      });
      this.belongsTo(models.Regions, {
        foreignKey: "region_id",
        as: "region",
        // onDelete: "CASCADE",
      });

      this.hasMany(models.Subscription, {
        foreignKey: "model_id",
        as: "subscriptions",
      });

      // this.belongsTo(models.users, {
      //   foreignKey: "user_id",
      // });
      // this.belongsTo(models.Regions, {
      //   foreignKey: "region_id",
      // });
    }
  }
  ModelProfile.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      region_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      website_url: DataTypes.STRING,
      social_links: DataTypes.JSON,
      location: DataTypes.STRING,
      gender: {
        type: DataTypes.ENUM("Male", "Female", "Non-Binary", "Other"),
        allowNull: false,
      },
      sexual_orientation: DataTypes.STRING,
      followers_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      earnings: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      subscription_price: {
        type: DataTypes.DECIMAL(6, 2),
        defaultValue: 0.0,
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_online: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      premium_access: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      content_visibility: {
        type: DataTypes.ENUM("all", "subscribers_only", "premium_only"),
        defaultValue: "all",
      },
      status: {
        type: DataTypes.ENUM("pending", "approved", "suspended"),
        defaultValue: "pending",
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "ModelProfile",
      tableName: "model_profiles",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return ModelProfile;
};
