const redis = require("../config/redis");

const cacheMiddleware = async (req, res, next) => {
  const key = req.originalUrl;
  const cachedData = await redis.get(key);

  if (cachedData) {
    return res.status(200).json(JSON.parse(cachedData));
  }

  res.sendResponse = res.json;
  res.json = (body) => {
    redis.setex(key, 3600, JSON.stringify(body));
    res.sendResponse(body);
  };

  next();
};

module.exports = cacheMiddleware;
