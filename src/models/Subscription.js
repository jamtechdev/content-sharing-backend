"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Subscription extends Model {
    static associate(models) {
      // Subscription belongs to a user (subscriber)
      Subscription.belongsTo(models.users, {
        foreignKey: "subscriber_id",
        as: "subscriber",
        // onDelete: "CASCADE",
      });
      // Subscription is linked to a model
      Subscription.belongsTo(models.ModelProfile, {
        foreignKey: "model_id",
        as: "model",
        // onDelete: "CASCADE",
      });
      // Subscription is linked to a plan
      Subscription.belongsTo(models.Plan, {
        foreignKey: "plan_id",
        as: "plan",
        // onDelete: "CASCADE",
      });
     
    }
  }

  Subscription.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      subscriber_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      model_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      plan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("active", "expired", "canceled"),
        defaultValue: "active",
        allowNull: false,
      },
      coins: {
        type: DataTypes.BIGINT
      },
      stripe_session_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      payment_mode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      plan_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      stripe_raw_data: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Subscription",
      tableName: "subscription_table",
      timestamps: true,
      // createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Subscription;
};
