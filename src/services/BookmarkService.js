const HttpError = require("../decorators/HttpError");
const BookmarkRepository = require("../repositories/BookmarkRepository");

class BookmarkService {
  async addBookmark(data) {
    return await BookmarkRepository.addBookmark(data);
  }

  async getBookmark(data){
    return await BookmarkRepository.getBookmark(data)
  }

  async getBookmarkbyUser(userId){
    return await BookmarkRepository.getBookmarkByUser(userId)
  }

  async removeBookmark(id){
    return await BookmarkRepository.removeBookmark(id)
  }
}

module.exports = new BookmarkService();
