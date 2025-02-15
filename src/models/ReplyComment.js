"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ReplyComment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ReplyComment.belongsTo(models.users, {
        foreignKey: "user_id",
        as: "user",
      }),
        ReplyComment.belongsTo(models.Content, {
          foreignKey: "content_id",
          as: "contentId",
        });
      ReplyComment.belongsTo(models.comment, {
        foreignKey: "comment_id",
        as: "comment",
      });
    }
  }
  ReplyComment.init(
    {
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      content_id: { type: DataTypes.INTEGER, allowNull: false },
      comment_id: { type: DataTypes.INTEGER, allowNull: false },
      reply_text: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "ReplyComment",
      // createdAt: "created_at",
      // updatedAt: "updated_at",
    }
  );
  return ReplyComment;
};
