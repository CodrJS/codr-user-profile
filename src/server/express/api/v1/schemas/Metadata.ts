import type { OpenAPIV3_1 } from "openapi-types";

const HealthSchema: OpenAPIV3_1.SchemaObject = {
  title: "Metadata Schema",
  properties: {
    env: {
      type: "string",
      examples: ["dev", "qa", "stage", "prod"],
      default: "dev",
    },
    version: {
      type: "string",
    },
    name: {
      type: "string",
    },
    node: {
      type: "object",
      properties: {
        env: {
          type: "string",
          examples: ["development", "production", "testing"],
          default: "production",
        },
        version: {
          type: "string",
        },
        modules: {
          type: "object",
        },
        yarnVersion: {
          type: "string",
        },
      },
    },
    docker: {
      type: "object",
      properties: {
        hostname: { type: "string" },
      },
    },
  },
};

export default HealthSchema;
