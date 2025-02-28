const db = require("../../models/index");
const ProductAttribute = db.product_attribute;
const Product = db.product;
const ProductCategory = db.product_category;

class ProductAttributeRepository {
  async create(data) {
    return await ProductAttribute.create(data);
  }

  async getAll() {
    return await ProductAttribute.findAll({
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

  async getById(attributeId) {
    return await ProductAttribute.findOne({
      where: { id: attributeId },
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

  // async getByProductId(productId) {
  //   return await ProductAttribute.findAll({
  //     where: { product_id: productId },
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

  async update(attributeId, data) {
    return await ProductAttribute.update(data, { where: { id: attributeId } });
  }

  async delete(attributeId) {
    return await ProductAttribute.destroy({ where: { id: attributeId } });
  }

  // async deleteByProductId(productId) {
  //   return await ProductAttribute.destroy({ where: { product_id: productId } });
  // }
}

module.exports = new ProductAttributeRepository();
