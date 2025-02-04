const express = require("express");

class Router {
  constructor() {
    this.router = express.Router();
  }

  addRoute(method, path, ...handlers) {
    this.router[method](path, ...handlers);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = Router;
