const db = require('../../models/index')

const OrderItem = db.order_items

class OrderItemsRepository {
    async create(data){
        return await OrderItem.create(data)
    }

    async getAll(){
        return await OrderItem.findAll({})
    }

    async getById(id){
        return await OrderItem.findOne({where: {id}})
    }

    async getByOrderId(id){
        return await OrderItem.findOne({where: {order_id: id}})
    }

    async updateById(data){
        return await OrderItem.update(data, {
            where: {id: data.id}
        })
    }

    async deleteByProductId(id){
        return await OrderItem.destroy({where: {product_id: id}})
    }

    async deleteById(id){
        return await OrderItem.destroy({where: {id}})
    }
}

module.exports = new OrderItemsRepository()