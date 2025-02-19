const db = require('../../models/index')

const OrderItem = db.order_items

class OrderItemsRepository {
    async create(data){
        return await OrderItem.create(data)
    }

    async getAll(){
        return await OrderItem.findAll({})
    }
}

module.exports = new OrderItemsRepository()