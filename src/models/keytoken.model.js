const mongoose = require("mongoose");

const COLLECTION_NAME = "Keytokens";
const DOCUMENT_NAME = "Keytoken";

const { Schema, model } = mongoose;

let keytokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    publicKey: {
      type: String,
      required: true,
    },
    privateKey: {
      type: String,
      required: true,
    },
    refreshTokensUsed: {
      type: Array,
      default: [],
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

keytokenSchema.statics.findByUser = async ({ userId }) => {
  return await Keytoken.findOne({ user: userId }).lean();
};

keytokenSchema.statics.removeById = async (id) => {
  return await Keytoken.findOneAndRemove(id);
};

keytokenSchema.statics.findByRefreshTokenUsed = async (refreshToken) => {
  return await Keytoken.findOne({ refreshTokensUsed: refreshToken }).lean();
};
keytokenSchema.statics.findByRefreshToken = async (refreshToken) => {
  return await Keytoken.findOne({ refreshToken });
};

const Keytoken = mongoose.model(DOCUMENT_NAME, keytokenSchema);

//Export the model
module.exports = Keytoken;
