const OrderItemsRepository = require("../../repositories/ProductRepository/OrderItemsRepository");
const ProductRepository = require("../../repositories/ProductRepository/ProductRepository");
const HttpError = require("../../decorators/HttpError");

class OrderItemsService {
  async createOrderItems(data) {
    const { order_id, product_id, quantity, price_per_item, total_price } =
      data;
    const product = await ProductRepository.getById(product_id);
    if (!product) {
      return {code: 404, message: "Product not found"}
    }
    let itemPrice = product.sale_price ? product.sale_price : product.price;
    let totalPrice = quantity * itemPrice;

    const orderExist = await OrderItemsRepository.getByOrderId(order_id);
    if (orderExist) {
      return {code: 409, message: "Order already created"}
    }
    data.price_per_item = itemPrice;
    data.total_price = totalPrice;
    return await OrderItemsRepository.create(data);
  }

  async getAllOrders() {
    const orders = await OrderItemsRepository.getAll();
    return orders;
  }

  async getOrderById(id) {
    const order = await OrderItemsRepository.getById(id);
    return order;
  }

  async updateOrder(data) {
    const { product_id, quantity } = data;
    const orderItem = await OrderItemsRepository.getById(data.id);
    if (product_id) {
      const product = await ProductRepository.getById(product_id);
      if (!product) {
        return {code: 404, message: "Product not found"}
      }
      const itemPrice = product.sale_price ? product.sale_price : product.price;
      const totalPrice = quantity ? quantity : orderItem.quantity * itemPrice;
      data.price_per_item = itemPrice;
      data.total_price = totalPrice;
    }
    if (quantity) {
      const totalPrice = quantity * orderItem.price_per_item;
      data.total_price = totalPrice;
    }
    return await OrderItemsRepository.updateById(data);
  }

  async deleteOrder(id) {
    return await OrderItemsRepository.deleteById(id);
  }
}

module.exports = new OrderItemsService();
