import type { OpenAPIV3_1 } from "openapi-types";

const HealthSchema: OpenAPIV3_1.SchemaObject = {
  title: "Health Schema",
  required: ["status", "services", "topics"],
  properties: {
    status: {
      type: "string",
      examples: ["UP", "DOWN"],
      default: "UP",
    },
    services: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "status"],
        properties: {
          name: {
            type: "string",
            examples: ["MongoDB", "Express API", "Kafka Admin"],
            default: "Express API",
          },
          status: {
            type: "string",
            examples: ["UP", "DOWN"],
            default: "UP",
          },
        },
      },
    },
    topics: {
      type: "object",
      properties: {
        consumers: { type: "object" },
        producers: { type: "object" },
      },
    },
  },
};

export default HealthSchema;
