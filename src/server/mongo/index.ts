import config from "@codrjs/config";
import { ServiceHealth } from "@codrjs/health";
import mongoose from "mongoose";
import MongoLogger from "./utils/logger";

export const start = async () => {
  // Setup Logger
  mongoose.connection.on("open", () => {
    MongoLogger.info("connected to database.");
  });
  mongoose.connection.on("reconnected", () => {
    MongoLogger.info("reconnected to database.");
  });
  mongoose.connection.on("disconnected", () => {
    MongoLogger.info("disconnected to database.");
  });

  // Setup heath check
  ServiceHealth.addMongo(mongoose.connection);

  // Connect to DB
  await mongoose.connect(config.mongo.uri);
};

export const stop = async () => {
  await mongoose.disconnect();
};
