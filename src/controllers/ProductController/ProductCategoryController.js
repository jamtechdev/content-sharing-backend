const Router = require("../../decorators/Router");
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const TryCatch = require("../../decorators/TryCatch");
const ProductCategoryService = require("../../services/ProductService/ProductCategoryService");

class ProductCategoryController {
  constructor() {
    this.router = new Router();

    this.router.addRoute(
      "post",
      "/create-category",
      authenticate,
      authorize(["admin"]), 
      TryCatch(this.createProductCategory.bind(this))
    );

    this.router.addRoute(
      "get",
      "/",
      authenticate,
      authorize(["admin"]),
      TryCatch(this.getAllProductCategories.bind(this))
    );

    this.router.addRoute(
      "get",
      "/:id",
      authenticate,
      authorize(["admin"]),
      TryCatch(this.getProductCategoryById.bind(this))
    );

    this.router.addRoute(
      "put",
      "/",
      authenticate,
      authorize(["admin"]),
      TryCatch(this.updateProductCategory.bind(this))
    );

    this.router.addRoute(
      "delete",
      "/:id",
      authenticate,
      authorize(["admin"]),
      TryCatch(this.deleteProductCategory.bind(this))
    );

    // this.router.addRoute(
    //   "get",
    //   "/name/:name",
    //   authenticate,
    // //   authorize(["admin"]),
    //   TryCatch(this.getProductCategoryByName.bind(this))
    // );
  }

  async createProductCategory(req, res) {
    const categoryData = req.body;
    const newCategory = await ProductCategoryService.createProductCategory(categoryData);
    return res.status(201).json({
      code: 201,
      success: true,
      message: "Product category created successfully",
      data: newCategory,
    });
  }

  async getAllProductCategories(req, res) {
    const categories = await ProductCategoryService.getAllProductCategories();
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product categories fetched successfully",
      data: categories,
    });
  }

  async getProductCategoryById(req, res) {
    const categoryId = req.params.id;
    const category = await ProductCategoryService.getProductCategoryById(categoryId);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product category fetched successfully",
      data: category,
    });
  }

  async updateProductCategory(req, res) {
    const updateData = req.body;
    const updatedCategory = await ProductCategoryService.updateProductCategory(updateData.categoryId, updateData);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product category updated successfully",
      data: updatedCategory,
    });
  }

  async deleteProductCategory(req, res) {
    const categoryId = req.params.id;
    await ProductCategoryService.deleteProductCategory(categoryId);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product category deleted successfully",
    });
  }

  // async getProductCategoryByName(req, res) {
  //   const name = req.params.name;
  //   const category = await ProductCategoryService.getProductCategoryByName(name);
  //   return res.status(200).json({
  //     code: 200,
  //     success: true,
  //     message: "Product category fetched successfully",
  //     data: category,
  //   });
  // }

  getRouter() {
    return this.router.getRouter();
  }
}

module.exports = new ProductCategoryController();
