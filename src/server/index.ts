import { start as ExpressStart, stop as ExpressStop } from "./express";
import { start as KafkaStart, stop as KafkaStop } from "./kafka";
import { start as MongoStart, stop as MongoStop } from "./mongo";

export const Express = { start: ExpressStart, stop: ExpressStop };
export const Kafka = { start: KafkaStart, stop: KafkaStop };
export const Mongo = { start: MongoStart, stop: MongoStop };
