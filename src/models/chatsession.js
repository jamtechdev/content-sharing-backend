'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatSession extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ChatSession.init({
    user_id: DataTypes.INTEGER,
    model_id: DataTypes.INTEGER,
    status: DataTypes.ENUM("pending", "active", "ended"),
    start_time: DataTypes.DATE,
    last_activity: DataTypes.DATE,
    duration: DataTypes.INTEGER,
    rating: {
      type: DataTypes.INTEGER,
      validate: {min: 1, max: 5}
    }
  }, {
    sequelize,
    modelName: 'chat_session',
  });
  return ChatSession;
};