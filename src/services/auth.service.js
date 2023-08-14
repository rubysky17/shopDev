const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const ROLES = require("../constants/roles.constant");
const KeyTokenService = require("./keyToken.service");
const { createTokensPair } = require("../auth/auth.utils");

const utils = require("../utils");
const { ConflictRequestError } = require("../core/error.response");

const SALTS_VALUE = 10; // The Difficult of Value to Handle

// ** Workflow for JWT and RSA
/**
 * B1: Kiểm tra shop đã được create chưa ? => Nếu đã create thì báo, chưa thì đi tiếp
 * B2: Tạo publicKey và privateKey từ RSA
 * B3: Lưu publicKey và privateKey vào keyModel
 * B4: Lưu keyModel thành công => tạo token => gồm accessToken và refreshToken (Với refreshToken có hạn dài hơn accessToken)
 * B5: Tạo thành công thì lưu lại và trả về cho USER => Hoàn tất quy trình tạo key
 */

class AuthService {
  static signup = async (body) => {
    const { name, email, password } = body;
    // ! Check Shop Exist
    const isExist = await shopModel.findOne({ email }).lean();

    if (isExist) {
      throw new ConflictRequestError("Shop is Created");
    }

    // ! Create
    const hashPassword = await bcrypt.hash(password, SALTS_VALUE);

    const newShop = await shopModel.create({
      name,
      email,
      password: hashPassword,
      roles: [ROLES["SHOP"]],
    });

    // ! If create success
    if (newShop) {
      // * Create privateKey, publicKey
      const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: "pkcs1",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs1",
          format: "pem",
        },
      });

      const keystore = await KeyTokenService.generateToken({
        shopId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keystore) {
        throw new ConflictRequestError("Keystore created error");
      }

      const tokens = await createTokensPair(
        {
          userId: newShop._id,
          email,
        },
        publicKey,
        privateKey
      );

      // console.log("Create Tokens Susscess::", tokens);

      return {
        code: 201,
        metadata: {
          shop: utils.getInfoData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }

    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AuthService;
