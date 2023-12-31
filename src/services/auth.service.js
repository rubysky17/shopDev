const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const ROLES = require("../constants/roles.constant");
const KeyTokenService = require("./keyToken.service");
const { createTokensPair, verifyJWT } = require("../auth/auth.utils");

const utils = require("../utils");
const {
  ConflictRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");

const SALTS_VALUE = 10; // The Difficult of Value to Handle

// ** Workflow for JWT and RSA
/**
 * B1: Kiểm tra shop đã được create chưa ? => Nếu đã create thì báo, chưa thì đi tiếp
 * B2: Tạo publicKey và privateKey từ RSA
 * B3: Lưu publicKey và privateKey vào keyModel
 * B4: Lưu keyModel thành công => tạo token => gồm accessToken và refreshToken (Với refreshToken có hạn dài hơn accessToken)
 * B5: Tạo thành công thì lưu lại và trả về cho USER => Hoàn tất quy trình tạo key
 */

// ** Workflow của việc Login 1 account
/**
 * B1: Kiểm tra Email trong DB
 * B2: Kiểm tra Password có match hay không ?
 * B3: Tạo accessToken và refreshToken và lưu lại
 * B4: Tạo ra tokens
 * B5: lấy data user và trả về thông tin cho người dùng
 */

// ** Workflow check Token đã được sử dụng
// B1: Kiểm tra RT đó có tồn tại trong token used hay không ?
// B2: Có => xoá hết thông tin user trong tokenModel
// B3: không => tạo ra 1 cặp token mới và lưu RT vào list Token used

class AuthService {
  static login = async ({ email, password, refreshToken }) => {
    const foundShop = await shopModel.findByEmail({ email });

    if (!foundShop) throw new ConflictRequestError("Is not find shop");

    const isMatch = await bcrypt.compare(password, foundShop.password);

    if (!isMatch) {
      throw new AuthFailureError("Password not correct");
    }

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

    const tokens = await createTokensPair(
      {
        userId: foundShop._id,
        email,
      },
      publicKey,
      privateKey
    );

    await KeyTokenService.generateToken({
      refreshToken: tokens.refreshToken,
      publicKey,
      privateKey,
      shopId: foundShop._id,
    });

    const shopResult = {
      shop: utils.getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };

    return shopResult;
  };

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

      const shopResult = {
        shop: utils.getInfoData({
          fields: ["_id", "name", "email"],
          object: newShop,
        }),
        tokens,
      };

      return shopResult;
    }

    return {
      code: 200,
      metadata: null,
    };
  };

  static logout = async (keyStore) => {
    return await KeyTokenService.removeToken(keyStore);
  };

  static handleRefreshToken = async (refreshToken) => {
    const foundToken =
      await KeyTokenService.findByRefreshTokenUsed(refreshToken);

    if (foundToken) {
      // Decode
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );

      await KeyTokenService.deleteById(userId);

      throw new ForbiddenError("Something went wrong");
    }

    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);

    if (!holderToken) throw new AuthFailureError("Not find holderToken");

    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );

    const foundUser = await shopModel.findByEmail({ email });

    if (!foundUser) throw new AuthFailureError("Not find by Email");

    const tokens = await createTokensPair(
      {
        userId,
        email,
      },
      holderToken.publicKey,
      holderToken.privateKey
    );

    // Save Token used
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });

    return {
      user: { userId, email },
      tokens,
    };
  };
}

module.exports = AuthService;
