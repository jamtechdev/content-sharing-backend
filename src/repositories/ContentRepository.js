const db = require("../models/index");
const Content = db.Content;
const User = db.users;
const Region = db.Regions;
const Likes = db.Likes;
const Comment = db.comment;
const ReplyComment = db.ReplyComment;
const Bookmarks = db.Bookmarks;

const { Op, where } = require("sequelize");

class ContentRepository {
  async create(data) {
    return await Content.create(data);
  }

  async getContent(regionId) {
    const regionArray = Array.isArray(regionId) ? regionId : [regionId];

    let content = await Content.findAll({
      where: { plan_id: null },
      include: [
        {model: User, as: "user" }
      ],
      order: [["createdAt", "DESC"]],
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
   
    for (const item of content) {
      const likesCount = await Likes.count({
        where: { content_id: item.id, is_like: true },
      });
      item.dataValues.likesCount = likesCount; // Add likesCount to the result
    }
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
    return await Likes.findAll({
      where: { content_id: contentId },
      include: [
        {
          model: User, // Assuming your Users model is imported
          as: "user",
          attributes: ["name", "email"], // Adjust attributes as needed
        },
        {
          model: Content, // Assuming your Content model is imported
          as: "contentId",
          attributes: ["title", "description"], // Adjust attributes as needed
        },
      ],
    });
  }

  async getLikeByUserId(userId) {
    return await Likes.findAll({
      where: { user_id: userId, is_like: 1 },
      include: [
        {
          model: User, // Assuming your Users model is imported
          as: "user",
          attributes: ["name", "email"], // Adjust attributes as needed
        },
        {
          model: Content, // Assuming your Content model is imported
          as: "contentId",
          attributes: ["title", "description"], // Adjust attributes as needed
        },
      ],
    });
  }

  async updateLikeByUsercontentId(data) {
    return await Likes.update(
      { is_like: data?.is_like },
      {
        where: { content_id: data?.content_id, user_id: data?.user_id },
      }
    );
  }

  async destroyLikeByContentUserId(contentId, userId) {
    return await Likes.destroy({
      where: { content_id: contentId, user_id: userId },
    });
  }

  async addComment(data) {
    return await Comment.create(data);
  }

  async getComment() {
    return await Comment.findAll({
      include: [
        {
          model: User, // Assuming your Users model is imported
          as: "user",
          attributes: ["name", "email"], // Adjust attributes as needed
        },
        {
          model: Content, // Assuming your Content model is imported
          as: "content",
          attributes: ["title", "description"], // Adjust attributes as needed
        },
      ],
      attributes: ["comment_text", "status"],
    });
  }

  async getCommentById(commnetId) {
    return await Comment.findOne({
      where: { id: commnetId },
      include: [
        {
          model: User, // Assuming your Users model is imported
          as: "user",
          attributes: ["name", "email"], // Adjust attributes as needed
        },
        {
          model: Content, // Assuming your Content model is imported
          as: "content",
          attributes: ["title", "description"], // Adjust attributes as needed
        },
      ],
      attributes: ["comment_text", "status"],
    });
  }

  async deleteComment(commnetId) {
    return await Comment.destroy({ where: { id: commnetId } });
  }

  async updateComment(data) {
    return await Comment.update(
      { comment_text: data?.comment_text },
      { where: { id: data?.id } }
    );
  }

  async replyComment(data) {
    return await ReplyComment.create(data);
  }

  async getReplyCommentByCommnet(commentId) {
    return await ReplyComment.findAll({
      where: { comment_id: commentId },
      include: [
        {
          model: User, // Assuming your Users model is imported
          as: "user",
          attributes: ["name", "email"], // Adjust attributes as needed
        },
        {
          model: Comment, // Assuming your Content model is imported
          as: "comment",
          attributes: ["comment_text"], // Adjust attributes as needed
        },
      ],
      attributes: ["id", "reply_text"],
    });
  }

  async updateReplyComment(data) {
    return await ReplyComment.update(
      { reply_text: data?.reply_text },
      {
        where: { id: data?.id, user_id: data?.user_id },
      }
    );
  }

  async deleteReplyComment(data) {
    return await ReplyComment.destroy({
      where: { id: data?.id, user_id: data?.user_id },
    });
  }
}

module.exports = new ContentRepository();
