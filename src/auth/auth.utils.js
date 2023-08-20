// ! Create accessToken and RefreshToken by publicKey and PrivateKey
const JWT = require("jsonwebtoken");
const { Types } = require("mongoose");

const { asyncHandler } = require("../auth/checkAuth.utils");
const Keytoken = require("../models/keytoken.model");
const { NotFoundError, AuthFailureError } = require("../core/error.response");

const REQUEST_HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const createTokensPair = async (payload, publicKey, privateKey) => {
  try {
    // ! AccessToken By Private
    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2 days",
    });

    // ! refreshToken By Private
    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7 days",
    });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    return {
      code: "Error_XXX",
      message: error.message,
      status: "error",
    };
  }
};

/**
 *
 * @param {*} shopId
 * @Return true => next
 * @Workflow
 * B1: Get userId từ Header sau đó check nó trong Model Keystore xem có tồn tai hay chưa ?
 * B2: Get accessToken từ header sau đó verify
 */
const authentication = asyncHandler(async (req, res, next) => {
  const { headers } = req;

  const clientId = headers[REQUEST_HEADER.CLIENT_ID];

  if (!clientId) throw new NotFoundError("Not found client id in header");

  const keyStore = await Keytoken.findByUser({
    userId: new Types.ObjectId(clientId),
  });

  if (!keyStore) throw new AuthFailureError("Not found client id in header");

  const accessToken = headers[REQUEST_HEADER.AUTHORIZATION];

  if (!accessToken)
    throw new AuthFailureError("Not found authorization in header");

  try {
    const decodeUser = await JWT.verify(accessToken, keyStore.publicKey);

    if (!decodeUser) throw new AuthFailureError("Token not verify correctly");

    if (clientId !== decodeUser.userId)
      throw new AuthFailureError("Not correct userId");

    req.keyStore = keyStore;

    return next();
  } catch (error) {
    throw new AuthFailureError("Token not verify correctly");
  }

  next();
});

module.exports = {
  createTokensPair,
  authentication,
};
