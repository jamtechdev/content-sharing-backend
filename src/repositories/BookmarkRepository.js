const db = require("../models/index");
const Content = db.Content;
const User = db.users;
const Bookmarks = db.Bookmarks;

class BookmarkRepository {
  async addBookmark(data) {
    return await Bookmarks.create(data);
  }

  async getBookmark(data) {
    return await Bookmarks.findOne({
      where: { user_id: data?.user_id, content_id: data?.content_id },
    });
  }

  async getBookmarkByUser(userId) {
    return await Bookmarks.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Content,
          as: "content",
          attributes: ["title", "description"], // Choose specific fields
        },
      ],
      attributes: ["id"],
      raw: true, // Returns a flat structure
      nest: false, // Prevents Sequelize from nesting objects
    });
  }

  async removeBookmark(id) {
    return await Bookmarks.destroy({ where: { id: id } });
  }
}

module.exports = new BookmarkRepository();
