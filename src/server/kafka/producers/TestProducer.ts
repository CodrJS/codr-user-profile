import { Producer } from "@codrjs/kafka";

// this should be imported from "@codrjs/models"
interface TestMessage {
  hello: "world";
}

const Topic = "test-topic";

const TestProducer = new Producer<TestMessage>(Topic);

export default TestProducer;
