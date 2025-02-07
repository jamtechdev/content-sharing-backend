"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Comment belongs to a user
      Comment.belongsTo(models.users, {
        foreignKey: "user_id",
        as: "user",
        onDelete: "CASCADE",
      });

      // Comment belongs to a piece of content
      Comment.belongsTo(models.Content, {
        foreignKey: "content_id",
        as: "content",
        onDelete: "CASCADE",
      });
    }
  }
  Comment.init(
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
      content_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      comment_text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("approved", "pending", "rejected"),
        defaultValue: "pending",
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "comment",
      tableName: "comment",
    }
  );
  return Comment;
};
