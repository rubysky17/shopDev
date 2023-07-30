"use strict";
// ! Apply singleton Pattern to Connect DB
const mongoose = require("mongoose");
// const { countConnect } = require("../helpers/check.connect");
const {
  DB_NAME,
  DB_PASSWORD,
  CLUSTER_NAME,
} = require("../configs/config.mongodb");

const connectString = `mongodb+srv://${DB_NAME}:${DB_PASSWORD}@${CLUSTER_NAME}.voq8xha.mongodb.net/`;

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
