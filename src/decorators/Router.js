const express = require("express");

class Router {
  constructor() {
    this.router = express.Router();
  }

  addRoute(method, path, handler) {
    this.router[method](path, handler);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = Router;
