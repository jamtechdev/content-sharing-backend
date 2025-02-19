"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
 
    await queryInterface.removeColumn("notifications", "user_id");
    await queryInterface.removeColumn("notifications", "status");


    await queryInterface.addColumn("notifications", "title", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("notifications", "receiver_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.addColumn("notifications", "sender_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.addColumn("notifications", "item_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn("notifications", "is_read", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });


    await queryInterface.addIndex("notifications", ["receiver_id"]);
    await queryInterface.addIndex("notifications", ["sender_id"]);
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.removeColumn("notifications", "title");
    await queryInterface.removeColumn("notifications", "receiver_id");
    await queryInterface.removeColumn("notifications", "sender_id");
    await queryInterface.removeColumn("notifications", "item_id");
    await queryInterface.removeColumn("notifications", "type");
    await queryInterface.removeColumn("notifications", "is_read");

 
    await queryInterface.addColumn("notifications", "user_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.addColumn("notifications", "status", {
      type: Sequelize.ENUM(["read", "unread"]),
      allowNull: false,
    });

    // Remove indexes
    await queryInterface.removeIndex("notifications", ["receiver_id"]);
    await queryInterface.removeIndex("notifications", ["sender_id"]);
  },
};
