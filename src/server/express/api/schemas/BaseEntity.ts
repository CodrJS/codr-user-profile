import type { OpenAPIV3_1 } from "openapi-types";

const BaseSchema: OpenAPIV3_1.SchemaObject = {
  title: "Base Schema",
  properties: {
    __v: {
      type: "number",
      examples: [0],
    },
    _id: {
      type: "string",
    },
    createdAt: {
      type: "string",
    },
    updatedAt: {
      type: "string",
    },
  },
};

export default BaseSchema;
