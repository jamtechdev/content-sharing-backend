const ProductOrderRepository = require("../../repositories/ProductRepository/ProductOrderRepository");
const ProductCouponsRepository = require("../../repositories/ProductRepository/ProductCouponsRepository");
const UserCouponRepository = require("../../repositories/UserCouponRepository");
const HttpError = require("../../decorators/HttpError");

class ProductOrderService {
  async createOrder(data, userId) {
    const currentDate = new Date();
    let {
      user_id,
      order_number,
      payment_method,
      total_amount,
      payment_status,
      coupon_id,
      offer_type,
      discount_applied,
      shipping_address,
      shipping_method,
      shipping_cost,
      status,
    } = data;

    if (coupon_id) {
      const coupon = await ProductCouponsRepository.getById(coupon_id);
      if (!coupon) {
        throw new HttpError(404, "Coupon not found");
      } else {
        const userCouponExist = await UserCouponRepository.getByCouponId(
          coupon_id,
          userId
        );
        const {
          discount_type,
          discount_value,
          start_date,
          end_date,
          min_order_amount,
        } = coupon;
        if (start_date <= currentDate && end_date >= currentDate) {
          if (userCouponExist) {
            console.log(
              "before count",
              userCouponExist.usage_count,
              coupon.max_usage_per_user
            );
            if (userCouponExist.usage_count < coupon.max_usage_per_user) {
              if (total_amount >= min_order_amount) {
                if (discount_type === "flat") {
                  data.total_amount =
                    total_amount - discount_value + shipping_cost;
                  data.discount_applied = discount_value;
                  let count = userCouponExist.usage_count + 1;
                  await UserCouponRepository.update({
                    usage_count: count,
                    id: userCouponExist.id,
                  });
                } else {
                  data.total_amount =
                    total_amount -
                    (total_amount * discount_value) / 100 +
                    shipping_cost;
                  data.discount_applied =
                    total_amount - (total_amount * discount_value) / 100;
                  let count = userCouponExist.usage_count + 1;
                  await UserCouponRepository.update({
                    usage_count: count,
                    id: userCouponExist.id,
                  });
                }
              } else {
                throw new HttpError(
                  404,
                  `Minimum order amount should be ${min_order_amount}`
                );
              }
            } else {
              throw new HttpError(
                400,
                "You reached maximum coupon usage limit"
              );
            }
          } else {
            throw new HttpError(404, "User coupon not found/invalid coupon");
          }
        } else {
          throw new HttpError(404, "Coupon is expired");
        }
      }
    }
    data.user_id = userId;
    const response = await ProductOrderRepository.create(data);
    return response;
  }

  async getAllOrders(userId) {
    const response = await ProductOrderRepository.getAll(userId);
    if (response.length === 0) {
      throw new HttpError(404, "Orders not found");
    }
    return response;
  }

  async getOrderById(id) {
    const response = await ProductOrderRepository.getById(id);
    if (!response) {
      throw new HttpError(404, "Order not found");
    }
    return response;
  }

  async updateOrder(data) {
    const order = await ProductOrderRepository.getById(data.id);
    if (!order) {
      throw new HttpError(404, "Order not found");
    }
    return await ProductOrderRepository.updateById(data);
  }

  async deleteOrder(id) {
    const order = await ProductOrderRepository.getById(id);
    if (!order) {
      throw new HttpError(404, "Order not found");
    }
    return await ProductOrderRepository.deleteById(id);
  }
}

module.exports = new ProductOrderService();
