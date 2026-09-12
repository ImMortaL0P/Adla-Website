const mcache = require('memory-cache');

const cacheMiddleware = (durationInSeconds) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    const key = '__express__' + req.originalUrl || req.url;
    const cachedBody = mcache.get(key);
    
    if (cachedBody) {
      res.send(cachedBody);
      return;
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        // Only cache 200 OK responses
        if (res.statusCode === 200) {
          mcache.put(key, body, durationInSeconds * 1000);
        }
        res.sendResponse(body);
      };
      next();
    }
  };
};

const clearCache = (routeKeyPattern) => {
  const keys = mcache.keys();
  keys.forEach(key => {
    if (key.includes(routeKeyPattern)) {
      mcache.del(key);
    }
  });
};

module.exports = {
  cacheMiddleware,
  clearCache
};
