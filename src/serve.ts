import Logger from "@codrjs/logger";
import { Kafka, Express, Mongo } from "./server";

// Kafka.start();
Express.start();
Mongo.start().catch(Logger.get("Mongo").error);

process.on("SIGINT", async function () {
  // await Kafka.stop();
  Express.stop();
  Mongo.stop();

  process.exit();
});
