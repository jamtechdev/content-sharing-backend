"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Plan extends Model {
    static associate(models) {
      // Plan belongs to a specific Model Profile
      Plan.belongsTo(models.ModelProfile, {
        foreignKey: "model_id",
        as: "model",
        onDelete: "CASCADE",
      });

      // Plan has many Subscriptions
      Plan.hasMany(models.Subscription, {
        foreignKey: "plan_id",
        as: "subscriptions",
        // onDelete: "CASCADE",
      });
    }
  }

  Plan.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      model_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: {
        //   model: "model_profiles",
        //   key: "id",
        // },
      },
      name: {
        type: DataTypes.ENUM("basic", "premium"),
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      is_premium_access_included: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      duration: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      coins: {
        type: DataTypes.BIGINT
      },
    },
    {
      sequelize,
      modelName: "Plan",
      tableName: "plans",
      createdAt: "created_at",
      updatedAt: "updated_at",
      timestamps: true,
    }
  );

  return Plan;
};
