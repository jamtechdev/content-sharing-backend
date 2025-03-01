const OrderItemsRepository = require("../../repositories/ProductRepository/OrderItemsRepository");
const ProductRepository = require('../../repositories/ProductRepository/ProductRepository')
const HttpError = require('../../decorators/HttpError')

class OrderItemsService {
  async createOrderItems(data) {
    const {
      order_id,
      product_id,
      quantity,
      price_per_item,
      total_price
    } = data;
    const product = await ProductRepository.getById(product_id)
    if(!product){
      throw new HttpError(404, "Product not found")
    }
    let itemPrice = product.sale_price? product.sale_price : product.price;
    let totalPrice = quantity * itemPrice

    const orderExist = await OrderItemsRepository.getByOrderId(order_id)
    if(orderExist){
      throw new HttpError(409, "Order already created")
    }
    data.price_per_item = itemPrice
    data.total_price = totalPrice
    return await OrderItemsRepository.create(data)
  }

  async getAllOrders(){
    const orders = await OrderItemsRepository.getAll();
    if(orders.length === 0){
      throw new HttpError(404, "Orders not found");
    }
    return orders;
  }

  async getOrderById(id){
    const order = await OrderItemsRepository.getById(id);
    if(!order){
      throw new HttpError(404, "Order not found");
    }
    return order;
  }

  async updateOrder(data){
    const {product_id, quantity} = data
    if(product_id){
      const product = await ProductRepository.getById(id)
      if(!product){
        throw new HttpError(404, "Product not found")
      }
      const itemPrice = product.sale_price? product.sale_price: product.price
      const totalPrice = quantity * itemPrice
      data.price_per_item = itemPrice;
      data.total_price = totalPrice;
    }
    console.log(data)
    return await OrderItemsRepository.updateById(data)
  }

  async deleteOrder(id){
    return await OrderItemsRepository.deleteById(id)
  }
}

module.exports = new OrderItemsService()