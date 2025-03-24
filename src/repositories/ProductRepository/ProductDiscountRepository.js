const db = require("../../models/index");
const ProductDiscount = db.product_discount;
const Product = db.product;
const ProductCategory = db.product_category;

class ProductDiscountRepository {
  async create(data) {
    return await ProductDiscount.create(data);
  }

  async getAll() {
    const currentDate = new Date();
    return await ProductDiscount.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          {
            start_date: { [db.Sequelize.Op.lte]: currentDate },
            end_date: { [db.Sequelize.Op.gte]: currentDate },
          },
          {
            start_date: { [db.Sequelize.Op.gte]: currentDate },
          }
        ],
        // status: {
        //   [db.Sequelize.Op.or]: ["active", "upcoming"]
        // }
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Product,
          as: "product",
          attributes: { exclude: ["createdAt", "updatedAt"] },
          include: [
            {
              model: ProductCategory,
              as: "category",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
        },
      ],
    });
  }

  async getById(discountId) {
    const currentDate = new Date();
    return await ProductDiscount.findOne({
      where: {
        id: discountId,
        [db.Sequelize.Op.or]: [
          {
            start_date: { [db.Sequelize.Op.lte]: currentDate },
            end_date: { [db.Sequelize.Op.gte]: currentDate },
          },
          {
            start_date: { [db.Sequelize.Op.gte]: currentDate }
          }
        ],
        // status: {
        //   [db.Sequelize.Op.or]: ["active", "upcoming"]
        // }
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Product,
          as: "product",
          attributes: { exclude: ["createdAt", "updatedAt"] },
          include: [
            {
              model: ProductCategory,
              as: "category",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
        },
      ],
    });
  }

  async getByProductId(productId) {
    // const currentDate = new Date()
    return await ProductDiscount.findOne({
      where: {
        product_id: productId,
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Product,
          as: "product",
          attributes: { exclude: ["createdAt", "updatedAt"] },
          include: [
            {
              model: ProductCategory,
              as: "category",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
        },
      ],
    });
  }

  // async getActiveDiscounts(productId) {
  //   const currentDate = new Date();
  //   return await ProductDiscount.findAll({
  //     where: {
  //       product_id: productId,
  //       start_date: { [db.Sequelize.Op.lte]: currentDate },
  //       end_date: { [db.Sequelize.Op.gte]: currentDate },
  //     },
  //     attributes: { exclude: ["createdAt", "updatedAt"] },
  //     include: [
  //       {
  //         model: Product,
  //         as: "product",
  //         attributes: { exclude: ["createdAt", "updatedAt"] },
  //         include: [
  //           {
  //             model: ProductCategory,
  //             as: "category",
  //             attributes: { exclude: ["createdAt", "updatedAt"] },
  //           },
  //         ],
  //       },
  //     ],
  //   });
  // }

  async update(discountId, data) {
    return await ProductDiscount.update(data, { where: { id: discountId } });
  }

  async deleteByProductId(id){
    return await ProductDiscount.destroy({where: {product_id: id}})
  }
  async delete(discountId) {
    return await ProductDiscount.destroy({ where: { id: discountId } });
  }

  // async deleteByProductId(productId) {
  //   return await ProductDiscount.destroy({ where: { product_id: productId } });
  // }
}

module.exports = new ProductDiscountRepository();
