"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Likes.belongsTo(models.users, {
        foreignKey: "user_id",
        as: "user",
      }),
        Likes.belongsTo(models.Content, {
          foreignKey: "content_id",
          as: "contentId",
        });
    }
  }
  Likes.init(
    {
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      content_id: { type: DataTypes.INTEGER, allowNull: false },
      is_like: {
        allowNull: true,
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Likes",
      tableName: "likes",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Likes;
};
