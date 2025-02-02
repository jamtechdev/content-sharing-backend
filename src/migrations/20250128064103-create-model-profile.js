"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("model_profiles", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      region_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      profile_picture: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cover_photo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      website_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      social_links: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      birthdate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      gender: {
        type: Sequelize.ENUM("Male", "Female", "Non-Binary", "Other"),
        allowNull: false,
      },
      sexual_orientation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      followers_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      earnings: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      subscription_price: {
        type: Sequelize.DECIMAL(6, 2),
        defaultValue: 0.0,
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_online: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      premium_access: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      content_visibility: {
        type: Sequelize.ENUM("all", "subscribers_only", "premium_only"),
        defaultValue: "all",
      },
      status: {
        type: Sequelize.ENUM("pending", "approved", "suspended"),
        defaultValue: "pending",
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
    await queryInterface.addIndex("model_profiles", ["user_id"]);
    await queryInterface.addIndex("model_profiles", ["region_id"]);
    await queryInterface.addIndex("model_profiles", ["username"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("model_profiles");
  },
};
