const db = require("../models/index");
const Content = db.Content;
const User = db.users;
const Region = db.Regions;
const Likes = db.Likes

const { Op, where } = require("sequelize");

class ContentRepository {
  async create(data) {
    return await Content.create(data);
  }

  async getContent(regionId) {
    const regionArray = Array.isArray(regionId) ? regionId : [regionId];

    let content = await Content.findAll({
      include: [
        { model: User, as: "user" },
        { model: Region, as: "region" },
      ],
    });
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
      region_id,
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
        region_id,
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

  async findAll(id) {
    return await Content.findAll({ where: { user_id: id } });
  }

  async addLike(data) {
    return await Likes.create(data);
  }

  async getLikeByContentUserId(contentId, userId) {
    return await Likes.findOne({
      where: { content_id: contentId, user_id: userId },
    });
  }

  async getLikeByContentId(contentId) {
    return await Likes.findAll({ where: { content_id: contentId } });
  }
  
  async getLikeByUserId(userId){
    return await Likes.findAll({ where: { user_id: userId } });
  }

  async updateLikeByUsercontentId(data){
    return await Likes.update({is_like:data?.is_like},{
      where: { content_id: data?.content_id, user_id: data?.user_id },
    });
  }

  async destroyLikeByContentUserId(contentId, userId) {
    return await Likes.destroy({
      where: { content_id: contentId, user_id: userId },
    });
  }
}

module.exports = new ContentRepository();
