'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  queryInterface.addColumn("product_discounts", "status", {
    type: Sequelize.ENUM("active", "expired", "upcoming")
  } )
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn("product_discounts", "status")
  }
};
