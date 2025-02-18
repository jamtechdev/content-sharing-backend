const db = require('../models')

const ProductOrder = db.product_order

class ProductOrderRepository {
    async createOrder(data){
        return await ProductOrder.create(data)
    }

    // async get
}