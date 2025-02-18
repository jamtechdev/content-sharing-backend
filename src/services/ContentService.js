const HttpError = require("../decorators/HttpError");
const ContentRepository = require("../repositories/ContentRepository");
const SubscriptionRepository = require("../repositories/SubscriptionRepository");
const PlanRepository = require("../repositories/PlanRepository");
const UserService = require("./UserService");

const db = require("../models/index");
const ModelProfile = db.ModelProfile;

class ContentService {
  async createContent(data) {
    const response = await ContentRepository.create(data);
    if (!response) {
      throw new HttpError(400, "Content not created");
    }
    return response;
  }

  // async getContent(region_id, userId) {
  //   const userSubscription = await SubscriptionRepository.getSubscriptionsByUserId(userId);
  //   if(userSubscription.length === 0){
  //     throw new HttpError("Please subscribe to watch content")
  //   }
  //   let userIds = []
  //   const userPlans = await Promise.all(
  //     userSubscription.map(async (item) => {
  //       const model = await ModelProfile.findOne({where: {id: item.model_id}})
  //       if(model){
  //         userIds.push(model.user_id)
  //       }
  //       return await PlanRepository.getPlanByIdAndModelId(
  //         item.plan_id,
  //         item.model_id
  //       );
  //     })
  //   );

  //   const uniqueUserIds = [...new Set(userIds)];
  //   const response = (
  //     await Promise.all(
  //       userPlans.flatMap((item) =>
  //         uniqueUserIds.map(async (user) => {
  //           const data = await ContentRepository.getByPlanId(item.id, user, region_id);
  //           return data || null;
  //         })
  //       )
  //     )
  //   ).filter(Boolean);

  //   if (response.length === 0) {
  //     throw new HttpError(404, "No content found");
  //   }
  //   return response;
  // }
  // async getContent(region_id, userId) {
  //   const userSubscription =
  //     await SubscriptionRepository.getSubscriptionsByUserId(userId);
  //   let response = await Promise.all(
  //     userSubscription.map(async (item) => {
  //       const content =
  //         await ContentRepository.getContentByModelIdAndPlanIdWithRegion(
  //           item.subscriptionPlan.model.user_id,
  //           item.plan_id,
  //           region_id
  //         );
  //       return content;
  //     })
  //   );
  //   response = response.flat();
  //   const freeContent = await ContentRepository.getFreeContent(region_id);
  //   if (freeContent.length > 0) {
  //     response = response.concat(freeContent);
  //   }

  //   return response;
  // }

  // const freeContent = await ContentRepository.getFreeContent(region_id);
  //     if (freeContent.length > 0) {
  //   response = response.concat(freeContent);
  // }

  async getContentForUser(userId, regionId) {
    const userSubscription = await SubscriptionRepository.getSubscriptionsByUserId(
      userId
    );
    if (!userSubscription) {
      return await ContentRepository.getFreeContent(regionId);
    }

    const userPlanName = userSubscription.subscriptionPlan.name.toLowerCase();

    const allPlans = await PlanRepository.getAll();

    const goldPlan = allPlans.find(
      (plan) => plan.name.toLowerCase() === "gold"
    );
    const premiumPlan = allPlans.find(
      (plan) => plan.name.toLowerCase() === "premium"
    );
    const basicPlan = allPlans.find(
      (plan) => plan.name.toLowerCase() === "basic"
    );

    if (!goldPlan || !premiumPlan || !basicPlan) {
      throw new Error(404,
        "Required plans (gold, premium, basic) are not defined in the plan table."
      );
    }

    let eligiblePlanIds = [];
    switch (userPlanName) {
      case "gold":
        eligiblePlanIds = [goldPlan.id, premiumPlan.id, basicPlan.id];
        break;
      case "premium":
        eligiblePlanIds = [premiumPlan.id, basicPlan.id];
        break;
      case "basic":
        eligiblePlanIds = [basicPlan.id];
        break;
      default:
        throw new HttpError(400, "Invalid user plan.");
    }

    let content = await ContentRepository.getContentByRegionAndPlans(
      regionId,
      eligiblePlanIds
    );
    let freeContent = await ContentRepository.getFreeContent(regionId);
    content = content.concat(freeContent);
    return content;
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
}
module.exports = new ContentService();
