'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("plans", "features", {
      type: Sequelize.TEXT('long'),
      allowNull: false
    })
    await queryInterface.changeColumn("plans", "name", {
      type: Sequelize.ENUM("basic", "premium", "exclusive"),
      allowNull: false
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("plans", "features")
    await queryInterface.changeColumn("plans", "name", {
      type: Sequelize.ENUM("basic", "premium")
    })
  }
};
