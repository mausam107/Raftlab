const redis = require('redis');
const client = redis.createClient();

function cacheMiddleware(req, res, next) {
  const { page, limit, sortField, sortOrder } = req.query;
  const cacheKey = `${page}_${limit}_${sortField}_${sortOrder}`;

  client.get(cacheKey, (err, data) => {
    if (err) {
      console.error('Redis cache error:', err);
      next();
      return;
    }

    if (data !== null) {
      res.json(JSON.parse(data));
    } else {
      res.sendResponse = res.json;
      res.json = (body) => {
        client.setex(cacheKey, 3600, JSON.stringify(body)); // Cache for 1 hour
        res.sendResponse(body);
      };
      next();
    }
  });
}

module.exports = cacheMiddleware;
