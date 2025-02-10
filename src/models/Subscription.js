"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Subscription extends Model {
    static associate(models) {
      // Subscription belongs to a user (subscriber)
      // Subscription.belongsTo(models.User, {
      //   foreignKey: 'subscriber_id',
      //   as: 'subscriber',
      //   onDelete: 'CASCADE'
      // });
      // // Subscription is linked to a model
      // Subscription.belongsTo(models.ModelProfile, {
      //   foreignKey: 'model_id',
      //   as: 'model',
      //   onDelete: 'CASCADE'
      // });
      // // Subscription is linked to a plan
      // Subscription.belongsTo(models.Plan, {
      //   foreignKey: 'plan_id',
      //   as: 'plan',
      //   onDelete: 'CASCADE'
      // });
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
        references: {
          model: "users",
          key: "id",
        },
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
    },
    {
      sequelize,
      modelName: "Subscription",
      tableName: "subscription_table",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Subscription;
};
