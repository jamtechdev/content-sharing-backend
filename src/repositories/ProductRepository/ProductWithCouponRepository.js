const db = require("../../models");
const ProductWithCoupon = db.product_with_coupon;
const ProductCoupon = db.product_coupon;
const Product = db.product;

class ProductWithCouponRepository {
  async create(data) {
    return await ProductWithCoupon.create(data);
  }

  async getAll() {
    return await ProductWithCoupon.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Product,
          as: "product",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: ProductCoupon,
          as: "coupon",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
  }

  async getById(id) {
    return await ProductWithCoupon.findOne({
      where: { id },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Product,
          as: "product",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: ProductCoupon,
          as: "coupon",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
  }

  // async getByProductId(productId) {
  //   return await ProductWithCoupon.findAll({
  //     where: { product_id: productId },
  //     attributes: { exclude: ["createdAt", "updatedAt"] },
  //     include: [
  //       {
  //         model: Product,
  //         as: "product",
  //         attributes: { exclude: ["createdAt", "updatedAt"] },
  //       },
  //       {
  //         model: ProductCoupon,
  //         as: "coupon",
  //         attributes: { exclude: ["createdAt", "updatedAt"] },
  //       },
  //     ],
  //   });
  // }

  async getByCouponId(couponId) {
    return await ProductWithCoupon.findAll({
      where: { coupon_id: couponId },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Product,
          as: "product",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: ProductCoupon,
          as: "coupon",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
  }

  async getByProductIdAndCouponId(productId, couponId){
    return await ProductWithCoupon.findOne({
      where: {
        product_id: productId,
        coupon_id: couponId
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Product,
          as: "product",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: ProductCoupon,
          as: "coupon",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    })
  }

  async update(data) {
    return await ProductWithCoupon.update(data, {
      where: { id: data.id },
    });
  }

  async delete(id) {
    return await ProductWithCoupon.destroy({
      where: { id },
    });
  }

  async deleteByProductId(productId) {
    return await ProductWithCoupon.destroy({
      where: { product_id: productId },
    });
  }

  // async deleteByCouponId(couponId) {
  //   return await ProductWithCoupon.destroy({
  //     where: { coupon_id: couponId },
  //   });
  // }
}

module.exports = new ProductWithCouponRepository();
