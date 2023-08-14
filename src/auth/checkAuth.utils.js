// * Middleware
const apiKeyService = require("../services/apikey.service");

const REQUEST_HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[REQUEST_HEADER.API_KEY]?.toString() || null;

    // check API KEY
    if (!key) {
      return res.status(403).json({
        message: "forbidden error",
      });
    }

    const objKey = await apiKeyService.findById(key);

    if (!objKey) {
      return res.status(403).json({
        message: "forbidden error",
      });
    } else {
      req.objKey = objKey;

      return next();
    }
  } catch (error) {
    return res.status(404).json({
      message: "Client error",
      error,
    });
  }
};

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: "Permission Denied",
      });
    } else {
      const validPermission = req.objKey.permissions.includes(permission);

      if (!validPermission) {
        return res.status(403).json({
          message: "Permission Denied",
        });
      } else {
        return next();
      }
    }
  };
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    return fn(req, res, next).catch(next);
  };
};

module.exports = { apiKey, permission, asyncHandler };
