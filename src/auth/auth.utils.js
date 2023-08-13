// ! Create accessToken and RefreshToken by publicKey and PrivateKey
const JWT = require("jsonwebtoken");

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

module.exports = {
  createTokensPair,
};
