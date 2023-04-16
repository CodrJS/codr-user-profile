import { Kafka, Express, Mongo } from "./server";

// Kafka.start();
Express.start();
Mongo.start();

process.on("SIGINT", async function () {
  // await Kafka.stop();
  Express.stop();
  Mongo.stop();

  process.exit();
});
