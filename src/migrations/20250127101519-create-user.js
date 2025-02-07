"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        isLowercase: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        isEmail: true,
      },
      email_verified_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      is_blocked_by_platform: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      birthdate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      social_links: {
        type: Sequelize.JSON, // Storing social media links as JSON
        allowNull: true,
      },
      access_token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      platform_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      avatar: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      region_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
    // await queryInterface.addColumn("users", "is_modal", {
    //   type: Sequelize.BOOLEAN,
    //   allowNull: true,
    // });
    // await queryInterface.addColumn("users", "cover_photo", {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    // })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
