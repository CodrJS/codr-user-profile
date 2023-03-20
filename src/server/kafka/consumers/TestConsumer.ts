import { KafkaMessage } from "kafkajs";
import { Consumer } from "@codrjs/kafka";

import dotenv from "dotenv";
dotenv.config();

// this should be imported from "@codrjs/models"
interface TestMessage {
  hello: "world";
}

const Topic = "test-topic";
const TopicGroup = process.env.KAFKA_CONSUMER_GROUP as string;

// @ts-ignore
const processor = function (payload: TestMessage, message: KafkaMessage) {
  // do stuff here
};

const TestConsumer = new Consumer<TestMessage>({
  processor,
  groupId: TopicGroup,
  topics: [Topic],
});

export default TestConsumer;
