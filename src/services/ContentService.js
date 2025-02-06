const HttpError = require("../decorators/HttpError");
const ContentRepository = require("../repositories/ContentRepository");
const UserService = require("./UserService");

class ContentService {
  async createContent(data) {
    const response = await ContentRepository.create(data);
    if (!response) {
      throw new HttpError(400, "Content not created");
    }
    return response;
  }
  async getContent(region_id) {
    // console.log(userId)
    // const { region_id } = await UserService.getUserById(userId);
    console.log(region_id);
    const response = await ContentRepository.getContent(region_id);
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
      region_id,
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
        region_id: region_id,
      },
      userId
    );
  }
  async deleteContent(contentId) {
    return await ContentRepository.delete(contentId);
  }

  async findAllContentById(id) {
    return await ContentRepository.findAll(id);
  }
}
module.exports = new ContentService();
