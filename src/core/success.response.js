"use strict";
const { StatusCodes, ReasonPhrases } = require("../helpers/httpStatusCode");

class SuccessResponse {
  constructor({
    message,
    status = StatusCodes.OK,
    reasonStatusCode = ReasonPhrases.OK,
    metadata = {},
    options = {},
  }) {
    this.message = !message ? reasonStatusCode : message;
    this.status = status;
    this.metadata = metadata;
    this.options = options;
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.CREATED,
    reasonStatusCode = ReasonPhrases.CREATED,
    metadata,
    options = {},
  }) {
    super({ message, statusCode, reasonStatusCode, metadata, options });
  }
}

class UPDATED extends SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.UPDATED,
    reasonStatusCode = ReasonPhrases.UPDATED,
    metadata,
    options = {},
  }) {
    super({ message, statusCode, reasonStatusCode, metadata, options });
  }
}

module.exports = {
  CREATED,
  OK,
  UPDATED,
};
