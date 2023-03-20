import type { OpenAPIV3_1 } from "openapi-types";

const GenericSchema: OpenAPIV3_1.SchemaObject = {
  title: "Generic Schema",
  required: ["message"],
  properties: {
    message: {
      type: "string",
      example: "Hello world!",
    },
    detail: {
      type: "object",
      properties: {},
    },
  },
};

export default GenericSchema;
