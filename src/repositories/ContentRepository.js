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

  // async getContent(regionId, id) {
  //   const subscription = await db.Subscription.findOne({
  //     where: { subscriber_id: id },
  //   });
  //   let content = await Content.findAll({
  //     where: {
  //       [Op.or]: [{ plan_id: null }, { premium_access: true }],
  //     },
  //     include: [
  //       { model: User, as: "user", attributes: ["name", "email", "avatar"] },
  //       { model: Region, as: "region" },
  //     ],
  //     order: [["createdAt", "DESC"]],
  //   });
  // content = content.filter((item) => {
  //   let itemRegionIds;
  //   try {
  //     itemRegionIds = JSON.parse(item.region_id);
  //   } catch (error) {
  //     itemRegionIds = [];
  //   }
  //   return (
  //     Array.isArray(itemRegionIds) &&
  //     itemRegionIds.some((region) => regionArray.includes(region))
  //   );
  // });
  // for (const item of content) {
  //   const likesCount = await Likes.count({
  //     where: { content_id: item.id, is_like: true },
  //   });
  //   item.dataValues.likesCount = likesCount;
  //   if (!subscription && !item.noplan_id) {
  //     item.dataValues.type = "locked";
  //     delete item.dataValues.media_url;
  //   }
  // }

  // return content;
  // }

  // async getContent(regionId, id) {
  //   const subscription = await db.Subscription.findOne({
  //     where: { subscriber_id: id },
  //   });
  //   console.log(subscription);

  //   let content = await Content.findAll({
  //     where: {
  //       region_id: {
  //         [db.Sequelize.Op.like]: `%${regionId}%`,
  //       },
  //     },
  //     attributes: {
  //       include: [
  //         [
  //           db.Sequelize.literal(`(
  //             SELECT COUNT(*)
  //             FROM likes
  //             WHERE likes.content_id = Content.id AND likes.is_like = 1
  //           )`),
  //           "likeCount",
  //         ],
  //         [
  //           db.Sequelize.literal(`(
  //             SELECT COUNT(*)
  //             FROM comment
  //             WHERE comment.content_id = Content.id
  //           )`),
  //           "commentCount",
  //         ],
  //       ],
  //     },
  //     include: [
  //       { model: User, as: "user", attributes: ["name", "email", "avatar"] },
  //       { model: Region, as: "region" },
  //     ],
  //     order: [["created_at", "DESC"]],
  //   });

  //   return content;
  // }

  async getContent(regionId, id) {
    const subscription = await db.Subscription.findOne({
      where: { subscriber_id: id },
    });

    let contentFilter = {
      region_id: {
        [db.Sequelize.Op.like]: `%${regionId}%`,
      },
    };

    if (subscription) {
      contentFilter[db.Sequelize.Op.or] = [
        { plan_id: null },
        { plan_id: subscription.plan_id },
      ];
    }

    const rows = await Content.findAll({
      where: contentFilter,
      attributes: [
        "id",
        "title",
        "description",
        "plan_id",
        "media_url",
        "region_id",
        "premium_access",
        "price",
        "status",
        "content_type",
        "created_at",
        [
          db.Sequelize.literal(`(
                    SELECT COUNT(*) 
                    FROM likes 
                    WHERE likes.content_id = Content.id AND likes.is_like = 1
                )`),
          "likeCount",
        ],
        [
          db.Sequelize.literal(`(
                    SELECT COUNT(*) 
                    FROM comment 
                    WHERE comment.content_id = Content.id
                )`),
          "commentCount",
        ],
      ],
      include: [
        { model: User, as: "user", attributes: ["name", "avatar"] },
        { model: Region, as: "region", attributes: ["name"] },
      ],
      order: [["created_at", "DESC"]],
    });

    let content = rows.map((item) => {
      let itemData = item.get();
      if (!subscription && itemData.plan_id !== null) {
        itemData.media_url = null;
        itemData.type = "locked";
      }
      return itemData;
    });

    return content;
  }

  async getContentById(contentId) {
    return await Content.findOne({
      where: { id: contentId },
      attributes: {
        include: [
          [
            db.Sequelize.literal(`(
              SELECT COUNT(*) 
              FROM likes 
              WHERE likes.content_id = Content.id AND likes.is_like = 1
            )`),
            "likeCount",
          ],
          [
            db.Sequelize.literal(`(
              SELECT COUNT(*) 
              FROM comment 
              WHERE comment.content_id = Content.id
            )`),
            "commentCount",
          ],
        ],
      },
      include: [{ model: User, as: "user", attributes: ["name"] }],
    });
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
      premium_access,
      price,
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
        premium_access,
        price,
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
    let content = await Content.findAll({
      where: { user_id: id },
      attributes: {
        include: [
          // Count likes
          [
            db.Sequelize.literal(`(
              SELECT COUNT(*) 
              FROM likes 
              WHERE likes.content_id = Content.id AND likes.is_like = 1
            )`),
            "likeCount",
          ],
          // Count comments
          [
            db.Sequelize.literal(`(
              SELECT COUNT(*) 
              FROM comment 
              WHERE comment.content_id = Content.id
            )`),
            "commentCount",
          ],
        ],
      },
      include: [
        { model: User, as: "user", attributes: ["name", "email", "avatar"] },
        { model: Region, as: "region" },
      ],
      order: [["created_at", "DESC"]],
    });

    return content;
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
    return await Comment.findAll({
      where: { id: commnetId, parent_comment_id: null },
      include: [
        {
          model: Comment,
          as: "replies",
          attributes: ["id", "comment_text", "status"],
          include: [
            {
              model: Comment,
              as: "replies",
              attributes: ["id", "comment_text", "status"],
              include: [
                {
                  model: User,
                  as: "user",
                  attributes: ["id", "name", "email", "avatar"],
                },
              ],
            },
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "email", "avatar"],
            },
          ],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "avatar"],
        },
      ],
      attributes: ["id", "comment_text", "status"],
    });
  }

  async getCommentByContentId(contentId) {
    return await Comment.findAll({
      where: { content_id: contentId, parent_comment_id: null },
      include: [
        {
          model: Comment,
          as: "replies",
          attributes: ["id", "comment_text", "status"],
          include: [
            {
              model: Comment,
              as: "replies",
              attributes: ["id", "comment_text", "status"],
              include: [
                {
                  model: User,
                  as: "user",
                  attributes: ["id", "name", "email", "avatar"],
                },
              ],
            },
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "email", "avatar"],
            },
          ],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "avatar"],
        },
      ],
      attributes: ["id", "comment_text", "status"],
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

  async getCommentByUserId(userId) {
    return await Comment.findAll({
      where: {
        user_id: userId,
        parent_comment_id: null,
      },
      // order: [["updated_at", "DESC"]],
      include: [
        {
          model: Comment,
          as: "replies",
          attributes: ["id", "comment_text", "status"],
          include: [
            {
              model: Comment,
              as: "replies",
              attributes: ["id", "comment_text", "status"],
              include: [
                {
                  model: User,
                  as: "user",
                  attributes: ["id", "name", "email", "avatar"],
                },
              ],
            },
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "email", "avatar"],
            },
          ],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "avatar"],
        },
      ],
      attributes: ["id", "comment_text", "status"],
    });
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
