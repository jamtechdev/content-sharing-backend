"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("subscription_table", "stripe_session_id", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("subscription_table", "payment_mode", {
      type: Sequelize.STRING,
      allowNull: true,
    }); 
    await queryInterface.addColumn("subscription_table", "plan_type", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("subscription_table", "stripe_raw_data", {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      "subscription_table",
      "stripe_session_id"
    );
    await queryInterface.removeColumn("subscription_table", "payment_mode");
    await queryInterface.removeColumn("subscription_table", "stripe_raw_data");
  },
};
