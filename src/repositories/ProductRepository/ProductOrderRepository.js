const db = require('../../models')

const ProductOrder = db.product_order

class ProductOrderRepository {
    async create(data){
        return await ProductOrder.create(data)
    }

    async getAll(userId){
        return await ProductOrder.findAll({where: {
            user_id: userId
        }})
    }
}
module.exports = new ProductOrderRepository()