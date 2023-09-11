// ** Token handler

const keyModel = require("../models/keytoken.model");
const { Types } = require("mongoose");

class KeyTokenService {
  static generateToken = async ({
    shopId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // level 0
      // const publicKeyString = publicKey.toString();
      // const privateKeyString = privateKey.toString();

      // const tokens = await keyModel.create({
      //   user: shopId,
      //   publicKey: publicKeyString,
      //   privateKey: privateKeyString,
      // });

      const filter = {
          user: shopId,
        },
        update = {
          publicKey,
          privateKey,
          refreshTokenUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true };

      const tokens = await keyModel.findOneAndUpdate(filter, update, options);

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return {
        code: "Error_XXX",
        message: error.message,
        status: "error",
      };
    }
  };

  static removeToken = async (keyStore) => {
    return await keyModel.removeById(keyStore._id);
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyModel.findByRefreshTokenUsed(refreshToken);
  };
  static findByRefreshToken = async (refreshToken) => {
    return await keyModel.findByRefreshToken(refreshToken);
  };

  static deleteById = async (userId) => {
    return await keyModel.findOneAndRemove({
      user: new Types.ObjectId(userId),
    });
  };
}

module.exports = KeyTokenService;
