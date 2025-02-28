const ProductWithCouponRepository = require("../../repositories/ProductRepository/ProductWithCouponRepository");
const ProductRepository = require("../../repositories/ProductRepository/ProductRepository");
const ProductCouponsRepository = require("../../repositories/ProductRepository/ProductCouponsRepository");
const HttpError = require("../../decorators/HttpError");

class ProductWithCouponService {
  async createProductWithCoupon(data) {
    const {product_id, coupon_id} = data
    const product = await ProductRepository.getById(product_id);
    if (!product) {
      throw new HttpError(404, "Product not found");
    }
    const coupon = await ProductCouponsRepository.getById(coupon_id);
    if (!coupon) {
      throw new HttpError(404, "Coupon not found");
    }
    const productWithCouponExist = await ProductWithCouponRepository.getByProductIdAndCouponId(product_id, coupon_id)
    if(productWithCouponExist){
      throw new HttpError("409", "Coupon already assigned to the product")
    }
    return await ProductWithCouponRepository.create(data);
  }

  async getAllProductsWithCoupons() {
    const productsWithCoupons = await ProductWithCouponRepository.getAll();
    if (productsWithCoupons.length === 0) {
      throw new HttpError(404, "No products with coupons found");
    }
    return productsWithCoupons;
  }

  async getProductWithCouponById(id) {
    const productWithCoupon = await ProductWithCouponRepository.getById(id);
    if (!productWithCoupon) {
      throw new HttpError(404, "Product with coupon not found");
    }
    return productWithCoupon;
  }

  async getProductsByCouponId(couponId) {
    const products = await ProductWithCouponRepository.getByCouponId(couponId);
    if (products.length === 0) {
      throw new HttpError(404, "No products found for this coupon");
    }
    return products;
  }

  // async getCouponsByProductId(productId) {
  //   const coupons = await ProductWithCouponRepository.getByProductId(productId);
  //   if (coupons.length === 0) {
  //     throw new HttpError(404, "No coupons found for this product");
  //   }
  //   return coupons;
  // }

  async updateProductWithCoupon(data) {
    const { product_id, coupon_id, id } = data;
    const productWithCouponExist = await ProductWithCouponRepository.getById(
      id
    );
    if (!productWithCouponExist) {
      throw new HttpError(404, `No product with coupon exist with id ${id}`);
    }
    if (product_id) {
      const product = await ProductRepository.getById(product_id);
      if (!product) {
        throw new HttpError(404, "Product not found");
      }
    }
    if (coupon_id) {
      const coupon = await ProductCouponsRepository.getById(coupon_id);
      if (!coupon) {
        throw new HttpError(404, "Coupon not found");
      }
    }
    await ProductWithCouponRepository.update(data);
    return await ProductWithCouponRepository.getById(id);
  }

  async deleteProductWithCoupon(id) {
    const productWithCoupon = await ProductWithCouponRepository.getById(id);
    if (!productWithCoupon) {
      throw new HttpError(404, "Product with coupon not found");
    }
    return await ProductWithCouponRepository.delete(id);
  }

  // async deleteByProductId(productId) {
  //   const productWithCouponExist = await ProductWithCouponRepository.getByProductId(productId)
  //   if(productWithCouponExist.length === 0){
  //     throw new HttpError(404, "No product with coupon found")
  //   }
  //   return await ProductWithCouponRepository.deleteByProductId(productId);
  // }

  // async deleteByCouponId(couponId) {
  //   const productWithCouponExist = await ProductWithCouponRepository.getByCouponId(couponId)
  //   if(productWithCouponExist.length === 0){
  //     throw new HttpError(404, "No product with coupon found")
  //   }
  //   return await ProductWithCouponRepository.deleteByCouponId(couponId);
  // }
}

module.exports = new ProductWithCouponService();
