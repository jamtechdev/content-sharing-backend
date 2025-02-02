"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Roles.hasMany(models.users, {
        foreignKey: "role_id",
        as: "users",
      });
     
    }
  }
  Roles.init(
    {
      name: DataTypes.STRING,
      guard_name: DataTypes.STRING,
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
      modelName: "Roles",
      tableName: "roles",
    }
  );
  return Roles;
};
