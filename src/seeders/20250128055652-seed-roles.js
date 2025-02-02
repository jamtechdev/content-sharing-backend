'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        name: 'admin',
        guard_name: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'model',
        guard_name: 'model',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'user',
        guard_name: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
