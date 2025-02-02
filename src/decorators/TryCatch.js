const logger = require("../utils/Logger");
function TryCatch(handler) {
  return async function (req, res, next) {
    try {
      await handler(req, res, next);
    } catch (error) {
      logger.error(`Error in ${handler.name}: ${error.message}`);
      next(error);
    }
  };
}

module.exports = TryCatch;
