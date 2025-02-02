"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "regions",
      [
        {
          name: "North America",
          code: "NA",
          country_code: "US",
          currency_code: "USD",
          description: "Region covering the USA and Canada",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Europe",
          code: "EU",
          country_code: "GB",
          currency_code: "EUR",
          description: "Region covering European countries",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Asia",
          code: "AS",
          country_code: "IN",
          currency_code: "INR",
          description: "Region covering Asian countries",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "South America",
          code: "SA",
          country_code: "BR",
          currency_code: "BRL",
          description: "Region covering South American countries",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Australia",
          code: "AU",
          country_code: "AU",
          currency_code: "AUD",
          description: "Region covering Australia and surrounding areas",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Africa",
          code: "AF",
          country_code: "ZA",
          currency_code: "ZAR",
          description: "Region covering African countries",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Middle East",
          code: "ME",
          country_code: "AE",
          currency_code: "AED",
          description: "Region covering the Middle East",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("regions", null, {});
  },
};
