"use strict";

const apikeyModel = require("../models/apikey.model");

const findById = async (key) => {
  //   const createKey = apikeyModel.create({
  //     key: "manhdat123",
  //     status: true,
  //     permissions: ["1111", "2222"],
  //   });
  const objectKey = await apikeyModel
    .findOne({
      key,
      status: true,
    })
    .lean();

  return objectKey;
};

module.exports = { findById };
