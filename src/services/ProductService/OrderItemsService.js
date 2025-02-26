const OrderItemsRepository = require("../../repositories/ProductRepository/OrderItemsRepository");

class OrderItemsService {
  async createOrderItems(data) {
    const {
      order_id,
      product_id,
      quantity,
      price_per_item,
      total_price
    } = data;

  }
}
