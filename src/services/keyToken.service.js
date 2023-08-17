// ** Token handler

const keyModel = require("../models/keytoken.model");

class KeyTokenService {
  static generateToken = async ({ shopId, publicKey, privateKey , refreshToken}) => {
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
}

module.exports = KeyTokenService;
