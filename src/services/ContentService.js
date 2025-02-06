const HttpError = require("../decorators/HttpError");
const ContentRepository = require("../repositories/ContentRepository");

class ContentService {
  async createContent(data) {
    const response = await ContentRepository.create(data);
    if (!response) {
      throw new HttpError(400, "Content not created");
    }
    return response;
  }

  async getContent(regionId) {
    const response = await ContentRepository.getContent(regionId);
    if (response.length === 0) {
      throw new HttpError(404, "Not content found");
    }
    return response;
  }

  async findById(contentId, userId) {
    const response = await ContentRepository.findById(contentId, userId);
    if (!response) {
      throw new HttpError(404, "No content found");
    }
    return response;
  }

  async updateContent(
    {
      status,
      title,
      description,
      category_id,
      media_url,
      content_type,
      contentId,
    },
    userId
  ) {
    return await ContentRepository.update(
      {
        status,
        title,
        description,
        category_id,
        media_url,
        content_type,
        contentId,
      },
      userId
    );
  }

  async deleteContent(contentId) {
    return await ContentRepository.delete(contentId);
  }
}

module.exports = new ContentService();
