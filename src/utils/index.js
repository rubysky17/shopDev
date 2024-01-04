"use strict";

const _ = require("lodash");
const { Types } = require("mongoose")

const convertToObjectIdMongodb = id => new Types.ObjectId(id)

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const getSelectDate = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const unGetSelectDate = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] === null || typeof obj[k] === "undefined") {
      delete obj[k];
    }
  });

  return obj;
};

/**
 * @function Hàm biến đổi objetc lồng nhau hàm này viết cho việc db.collection.updateOne({a.b = 1, a.c = 2})
 * @input {Object} params: {a: {b : 1, c: 2}}
 * @returns params: {a.b = 1, a.c = 2}
 */

const updateNestedObjectParser = (obj, parent, result = {}) => {
  Object.keys(obj).forEach((k) => {
    const propName = parent ? `${parent}.${k}` : k;

    if (typeof obj[k] == "object" && !Array.isArray(obj[k])) {
      updateNestedObjectParser(obj[k], propName, result);
    } else {
      result[propName] = obj[k];
    }
  });

  return result;
};

module.exports = {
  getInfoData,
  getSelectDate,
  unGetSelectDate,
  removeUndefinedObject,
  updateNestedObjectParser,
  convertToObjectIdMongodb
};
