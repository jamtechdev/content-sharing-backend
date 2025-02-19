"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Bookmarks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Bookmarks.belongsTo(models.users, {
        foreignKey: "user_id",
        as: "user",
      });

      Bookmarks.belongsTo(models.Content, {
        foreignKey: "content_id",
        as: "content",
      });
    }
  }
  Bookmarks.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      content_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Content", key: "id" },
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,  
      modelName: "Bookmarks",
      tableName: "bookmarks",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Bookmarks;
};
