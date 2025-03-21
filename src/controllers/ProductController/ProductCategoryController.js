const ProductCategoryService = require("../../services/ProductService/ProductCategoryService");
const Router = require("../../decorators/Router");
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const TryCatch = require("../../decorators/TryCatch");

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
    if(newCategory.status === 409){
      return res.status(409).json({
        code: 409,
        success: false,
        message: newCategory.message,
      });
    }
    return res.status(201).json({
      code: 201,
      success: true,
      message: "Product category created successfully",
      data: newCategory,
    });
  }

  async getAllProductCategories(req, res) {
    const categories = await ProductCategoryService.getAllProductCategories();
    if(categories.length === 0){
      return res.status(200).json({
        code: 200,
        success: true,
        message: "Product categories not found"
      });
    }
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
    if(category){
      return res.status(200).json({
        code: 200,
        success: true,
        message: "Product category not found"
      });
    }
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product category fetched successfully",
      data: category,
    });
  }

  async updateProductCategory(req, res) {
    const updateData = req.body;
    const response = await ProductCategoryService.updateProductCategory(updateData.categoryId, updateData);
    if(response.code === "ERR404"){
      return res.status(404).json({
        code: 404,
        success: true,
        message: response.message,
      });
    }
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product category updated successfully",
    });
  }

  async deleteProductCategory(req, res) {
    const categoryId = req.params.id;
    const response = await ProductCategoryService.deleteProductCategory(categoryId);
    if(response.code === "ERR404"){
      return res.status(404).json({
        code: 404,
        success: true,
        message: response.message,
      });
    }
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
