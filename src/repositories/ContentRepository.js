const db = require("../models/index");
const Content = db.Content;
const User = db.users;
const Region = db.Regions;

const { Op } = require("sequelize");

class ContentRepository {
  async create(data) {
    return await Content.create(data);
  }

  async getContent(regionId) {
    const regionArray = Array.isArray(regionId) ? regionId : [regionId];

    let content = await Content.findAll({include: [{model: User, as: "user"}, {model: Region, as: "region"}]});
    content = content.filter((item) => {
      let itemRegionIds;
      try {
        itemRegionIds = JSON.parse(item.region_id); // Parse stringified array
      } catch (error) {
        itemRegionIds = []; // If parsing fails, treat as an empty array
      }
      return (
        Array.isArray(itemRegionIds) &&
        itemRegionIds.some((id) => regionArray.includes(id))
      );
    });
    return content;
  }

  async findById(contentId, userId) {
    return await Content.findOne({ where: { id: contentId, user_id: userId } });
  }
  async update(
    {
      status,
      title,
      description,
      category_id,
      media_url,
      content_type,
      contentId,
      region_id
    },
    userId
  ) {
    return await Content.update(
      {
        status,
        title,
        description,
        category_id,
        media_url,
        content_type,
        contentId,
        region_id
      },
      { where: { id: contentId, user_id: userId } }
    );
  }

  async delete(contentId) {
    const content = await Content.findOne({ where: { id: contentId } });
    if (!content) {
      return {
        code: 404,
        message: "Content not found or already deleted",
      };
    }
    return await content.destroy();
  }
}

module.exports = new ContentRepository();
