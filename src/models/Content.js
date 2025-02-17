"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Content extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Content.belongsTo(models.ContentCategory, {  
      //   foreignKey: "category_id",
      //   as: "category"
      // })

      Content.hasMany(models.Likes, {
        foreignKey: "content_id",
        as: "likes"
      })

      // Content belongs to a user
      Content.belongsTo(models.users, {
        foreignKey: "user_id",
        as: "user",
        onDelete: "CASCADE",
      });
      // // Content belongs to a category
      // Content.belongsTo(models.ContentCategory, {
      //   foreignKey: "category_id",
      //   as: "category",
      //   onDelete: "CASCADE",
      // });
      // // Content may belong to a plan
      // Content.belongsTo(models.Plan, {
      //   foreignKey: "plan_id",
      //   as: "plan",
      //   onDelete: "SET NULL",
      // });
      // // Content may be restricted to a region
      Content.belongsTo(models.Regions, {
        foreignKey: "region_id",
        as: "region",
        onDelete: "SET NULL",
      });
      
    }
  }
  Content.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      media_url: {
        type: DataTypes.TEXT,
        // allowNull: false,
      },
      content_type: {
        type: DataTypes.ENUM("image", "video", "audio", "document"),
        allowNull: false,
      },
      plan_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      premium_access: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      region_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      content_visibility: {
        type: DataTypes.ENUM("all", "subscribers_only", "premium_only"),
        defaultValue: "all",
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active",
      },
      
    },
    {
      sequelize,
      modelName: "Content",
      tableName: "contents",
      
    }
  );
  return Content;
};
