// ** Token handler

const keyModel = require("../models/keytoken.model");

class KeyTokenService {
  static generateToken = async ({ shopId, publicKey, privateKey }) => {
    try {
      const publicKeyString = publicKey.toString();
      const privateKeyString = privateKey.toString();

      const tokens = await keyModel.create({
        user: shopId,
        publicKey: publicKeyString,
        privateKey: privateKeyString,
      });

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
