"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Message.init(
    {
      message: DataTypes.STRING,
      senderId: DataTypes.INTEGER,
      receiverId: DataTypes.INTEGER,
      mediaUrl: DataTypes.TEXT("long"),
      mediaType: DataTypes.STRING,
      mediaSize: DataTypes.FLOAT,
      messageId: {
        type: DataTypes.STRING
      },
      status: DataTypes.ENUM("sent", "pending", "delivered", "seen"),
      isEdited: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      deletedBy: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
    },
    {
      timestamps: true,
      sequelize,
      modelName: "Message",
    }
  );
  return Message;
};
