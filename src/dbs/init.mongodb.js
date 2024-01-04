"use strict";
// ! Apply singleton Pattern to Connect DB
const mongoose = require("mongoose");
// const { countConnect } = require("../helpers/check.connect");
const {
  PORT_MONGODB,
  NAME_DB,
} = require("../configs/config.mongodb");

const connectString = `${PORT_MONGODB}/${NAME_DB}`;

class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectString, {
        maxPoolSize: 50,
      })
      .then((_) => console.log("Connected to mongo DB successfully"))
      .catch((err) => console.log("Error"));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongoDB = Database.getInstance();

module.exports = instanceMongoDB;
