module.exports = {
  async up(queryInterface, Sequelize) {
    // Replace 'column_name' with the actual column you want to remove
    await queryInterface.removeColumn("contents", "media_url");
  },

  async down(queryInterface, Sequelize) {
    // If you need to roll back, re-add the column with the correct type
    await queryInterface.addColumn("contents", "media_url", {
      type: Sequelize.STRING, // Replace with the actual data type
      allowNull: true, // Adjust as needed
    });
  },
};
