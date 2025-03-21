"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DeviceToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DeviceToken.belongsTo(models.users, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }
  DeviceToken.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_loggedin: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "DeviceToken",
      tableName: "devices_tokens",
      // updatedAt: "updated_at",
      // createdAt: "created_at",
    }
  );
  return DeviceToken;
};
