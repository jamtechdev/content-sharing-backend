"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class VideoCall extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  VideoCall.init(
    {
      caller_id: DataTypes.INTEGER,
      receiver_id: DataTypes.INTEGER,
      channel_name: DataTypes.STRING,
      start_time: DataTypes.DATE,
      end_time: DataTypes.DATE,
      status: {
        type: DataTypes.ENUM(
          "initiated",
          "noreply",
          "rejected",
          "ongoing",
          "ended"
        ),
        defaultValue: "initiated",
      },
    },
    {
      sequelize,
      modelName: "video_call",
    }
  );
  return VideoCall;
};
