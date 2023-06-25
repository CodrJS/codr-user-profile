import { ServiceHealth } from "@codrjs/health";
import Mongo from "@/utils/Mongo";
import MongoLogger from "./utils/logger";

export const start = async () => {
  // Connect to DB
  await Mongo.connect(connection => {
    // Setup Logger
    connection.on("open", () => {
      MongoLogger.info("connected to database.");
    });
    connection.on("reconnected", () => {
      MongoLogger.info("reconnected to database.");
    });
    connection.on("disconnecting", () => {
      MongoLogger.info("disconnecting from database.");
    });
    connection.on("disconnected", () => {
      MongoLogger.info("disconnected from database.");
    });

    // Setup heath check
    ServiceHealth.addMongo(connection);
  });
};

export const stop = async () => {
  await Mongo.close();
};
