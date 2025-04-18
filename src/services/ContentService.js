const HttpError = require("../decorators/HttpError");
const ContentRepository = require("../repositories/ContentRepository");
const SubscriptionRepository = require("../repositories/SubscriptionRepository");
const UserService = require("./UserService");
const { timeRangeCalculator } = require('../utils/subscriptionUtils')

class ContentService {
  async createContent(data) {
    const response = await ContentRepository.create(data);
    if (!response) {
      throw new HttpError(400, "Content not created");
    }
    return response;
  }
  async getContent(region_id, id) {
    // console.log(userId)
    // const { region_id } = await UserService.getUserById(userId);
    const response = await ContentRepository.getContent(region_id, id);
    if (response.length === 0) {
      throw new HttpError(404, "Not content found");
    }
    return response;
  }

  async getContentById(contentId) {
    return await ContentRepository.getContentById(contentId)
  }

  async findById(contentId, userId) {
    const response = await ContentRepository.findById(contentId, userId);
    // if (!response) {
    //   throw new HttpError(404, "No content found");
    // }
    return response;
  }

  async getRandomContent(plan, userId) {
    if (plan !== "basic" && plan !== "premium" && plan !== "noPlan") {
      return { code: 400, message: "You don't have any valid subscription plan" }
    }
    const subscription = await SubscriptionRepository.getByUser(userId)
    let remainingDays = timeRangeCalculator(subscription?.content_grant);
    if (remainingDays === 0 && subscription.end_date >= new Date()) {
      plan = plan === "basic" ? "premium" : plan === "premium" ? "exclusive" : "noPlan"
      return await ContentRepository.getRandom(plan)
    }
    else if (remainingDays < 0) {
      const now = new Date()
      now.setDate(now.getDate() + 90);
      const newDate = new Date(now)
      await SubscriptionRepository.update(subscription.id, { content_grant: newDate })
      return { code: 400, message: "Your quarterly 24hr premium premium pass expired" }
    }
    return { code: 400, message: "No content to preview" }
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
      premium_access,
      price,
      plan_id
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
        premium_access,
        price,
        plan_id
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

  async addLike(data) {
    const response = await ContentRepository.addLike(data);
    if (!response) {
      throw new HttpError(400, "Content not created");
    }
    return response;
  }
  async getLikeByContentUserId(contentId, userId) {
    const response = await ContentRepository.getLikeByContentUserId(
      contentId,
      userId
    );
    // if (!response) {
    //   throw new HttpError(400, "Content not created");
    // }
    return response;
  }

  async updateLikeByUsercontentId(data) {
    return await ContentRepository.updateLikeByUsercontentId(data);
  }
  async getLikeByContentId(contentId) {
    const response = await ContentRepository.getLikeByContentId(contentId);
    if (!response) {
      throw new HttpError(400, "Content not created");
    }
    return response;
  }
  async getLikeByUserId(userId) {
    const response = await ContentRepository.getLikeByUserId(userId);
    if (!response) {
      throw new HttpError(400, "Content not created");
    }
    return response;
  }
  async destroyLikeByContentUserId(contentId, userId) {
    const response = await ContentRepository.destroyLikeByContentUserId(
      contentId,
      userId
    );
    if (!response) {
      throw new HttpError(400, "Content not created");
    }
    return response;
  }
  async addComment(data) {
    const response = await ContentRepository.addComment(data);
    return response;
  }
  async getComment() {
    const response = await ContentRepository.getComment();
    return response;
  }
  async getCommentById(commnetId) {
    return await ContentRepository.getCommentById(commnetId);
  }
  async getCommentByUserId(userId) {
    return await ContentRepository.getCommentByUserId(userId);
  }
  async getCommentByContentId(contentId) {
    return await ContentRepository.getCommentByContentId(contentId);
  }
  async deleteCommentById(commnetId) {
    return await ContentRepository.deleteComment(commnetId);
  }
  async updateComment(data) {
    return await ContentRepository.updateComment(data);
  }
  async replyComment(data) {
    return await ContentRepository.replyComment(data);
  }
  async getReplyCommentByCommnet(commentId) {
    return await ContentRepository.getReplyCommentByCommnet(commentId);
  }
  async updateReplyComment(data) {
    return await ContentRepository.updateReplyComment(data);
  }
  async deleteReplyComment(data) {
    return await ContentRepository.deleteReplyComment(data);
  }

  async deleteCommentByContentId(id) {
    return await ContentRepository.deleteCommentByContentId(id)
  }

  async deleteLikeByContentId(id) {
    return await ContentRepository.deleteLikeByContentId(id)
  }
}
module.exports = new ContentService();
