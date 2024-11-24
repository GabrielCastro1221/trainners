const mongoose = require("mongoose");
const configObject = require("./env.config");
const { logger } = require("../middlewares/logger.middleware");

class DataBase {
  static #instance;
  constructor() {
    this.connectWithRetry();
  }
  async connectWithRetry() {
    try {
      await mongoose.connect(configObject.server.mongo_url, {
        connectTimeoutMS: 10000,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      logger.info("MongoDB conectado satisfactoriamente");
    } catch (error) {
      logger.error(`MongoDB error en la conexion: ${error.message}`);
      setTimeout(() => {
        logger.info("MongoDB reintentando conectarse...");
        this.connectWithRetry();
      }, 5000);
    }
  }
  static getInstance() {
    if (!this.#instance) {
      this.#instance = new DataBase();
    }
    return this.#instance;
  }
}

module.exports = DataBase.getInstance();
