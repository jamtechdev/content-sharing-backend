module.exports = {
  async up(queryInterface, Sequelize) {
    // Rename the column from 'old_column_name' to 'new_column_name'
    await queryInterface.renameColumn("contents", "media_url_json", "media_url");
  },

  async down(queryInterface, Sequelize) {
    // If rolling back, rename it back to the old name
    await queryInterface.renameColumn("contents", "media_url_json", "media_url");
  },
};
