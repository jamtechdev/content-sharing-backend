const ProductOrderRepository = require("../../repositories/ProductRepository/ProductOrderRepository");
const HttpError = require('../../decorators/HttpError')

class ProductOrderService {
  async createOrder(data, userId) {
    const {
    //   user_id,
    //   order_number,
    //   payment_method,
    //   total_amount,
    //   payment_status,
    //   coupon_id,
    //   offer_type,
    //   discount_applied,
    //   shipping_address,
    //   shipping_method,
    //   shipping_cost,
    //   status
    } = data;
    data.user_id = userId
    const response = await ProductOrderRepository.create(data)
    return response
  }

  async getAllOrders(userId){
    const response = await ProductOrderRepository.getAll(userId)
    if(response.length === 0){
      throw new HttpError(404, "Orders not found")
    }
    return response
  }
}

module.exports = new ProductOrderService()
