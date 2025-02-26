const db = require("../models/index");
const Content = db.Content;
const User = db.users;
const Region = db.Regions;
const Likes = db.Likes;
const Comment = db.comment;
const ReplyComment = db.ReplyComment;
const Bookmarks = db.Bookmarks;
const Plan = db.Plan;

const { Op, where } = require("sequelize");

class ContentRepository {
  async create(data) {
    return await Content.create(data);
  }

  async getContent(regionId) {
    const regionArray = Array.isArray(regionId) ? regionId : [regionId];

    let content = await Content.findAll({
      include: [{ model: User, as: "user" }],
      order: [["createdAt", "DESC"]],
    });

    content = content.filter((item) => {
      let itemRegionIds;
      try {
        itemRegionIds = JSON.parse(item.region_id);
      } catch (error) {
        itemRegionIds = [];
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
      item.dataValues.likesCount = likesCount;
    }
    return content;
  }

  // async getContentByModelIdAndPlanIdWithRegion(userId, planId, regionId) {
  //   let response = await Content.findAll({
  //     where: {
  //       region_id: {
  //         [db.Sequelize.Op.like]: `%${regionId}%`,
  //       },
  //       user_id: userId,
  //       // [db.Sequelize.Op.or]: [
  //       // plan_id: planId, // Content for the user's subscription plan
  //         // { plan_id: 0 },      // Free content (plan_id = 0)
  //       // ],
  //     },
  //     include: [{model: Plan, as: "userPlan"}]
  //   });

  //   return response
  // }

  // async getContentByModelIdAndPlanIdWithRegion(regionId, userSubscription) {
  //   let response = await Content.findAll({
  //     where: {
  //       region_id: {
  //         [db.Sequelize.Op.like]: `%${regionId}%`,
  //       },
  //     },
  //     include: [{model: Plan, as: "userPlan"}]
  //   });
  //   return response
  // }

  async getContentByRegionAndPlans(regionId, planIds) {
    const content = await Content.findAll({
      where: {
        region_id: {
          [db.Sequelize.Op.like]: `%${regionId}%`,
        },
        plan_id: {
          [db.Sequelize.Op.in]: planIds,
        },
      },
    });
    console.log(content);
    for (const item of content) {
      const likesCount = await Likes.count({
        where: { content_id: item.id, is_like: true },
      });
      item.dataValues.likesCount = likesCount;
    }
    return content;
  }

  async getFreeContent(regionId) {
    const content = await Content.findAll({
      where: {
        plan_id: 0,
        region_id: {
          [db.Sequelize.Op.like]: `%${regionId}%`,
        },
      },
    });
    for (const item of content) {
      const likesCount = await Likes.count({
        where: { content_id: item.id, is_like: true },
      });

      item.dataValues.likesCount = likesCount;
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

  async getByPlanId(id, userId, regionId) {
    const data = await Content.findAll({
      where: {
        region_id: {
          [Op.like]: `%${regionId}%`,
        },
        plan_id: id,
        user_id: userId,
      },
    });
    return data;
  }

  async getPremiumContent(regionId, modelId, isPremium) {
    return await Content.findAll({
      where: {
        region_id: {
          [Op.like]: `%${regionId}%`,
        },
        user_id: modelId,
      },
    });

    //  let response
    //  if(isPremium === true){
    //   return response = await Content.findAll({
    //     where: {
    //       region_id: {
    //         [Op.like]: `%${regionId}%`,
    //       },
    //       user_id: modelId,
    //     },
    //   })

    //  }
    //  else {
    //   return response = await Content.findAll({
    //     where: {
    //       region_id: {
    //         [Op.like]: `%${regionId}%`,
    //       },
    //       user_id: modelId,
    //       premium_access: false,
    //     },
    //   });
    //  }
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
          model: User,
          as: "user",
          attributes: ["name", "email"],
        },
        {
          model: Content,
          as: "contentId",
          attributes: ["title", "description"],
        },
      ],
    });
  }

  async getLikeByUserId(userId) {
    return await Likes.findAll({
      where: { user_id: userId, is_like: 1 },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "email"],
        },
        {
          model: Content,
          as: "contentId",
          attributes: ["title", "description"],
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
          model: User,
          as: "user",
          attributes: ["name", "email"],
        },
        {
          model: Content,
          as: "content",
          attributes: ["title", "description"],
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
          model: User,
          as: "user",
          attributes: ["name", "email"],
        },
        {
          model: Content,
          as: "content",
          attributes: ["title", "description"],
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
          model: User,
          as: "user",
          attributes: ["name", "email"],
        },
        {
          model: Comment,
          as: "comment",
          attributes: ["comment_text"],
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
