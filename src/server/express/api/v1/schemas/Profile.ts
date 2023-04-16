import type { OpenAPIV3_1 } from "openapi-types";

const ProfileSchema: OpenAPIV3_1.SchemaObject = {
  title: "Profile Entity Schema",
  allOf: [{ $ref: "#/components/schemas/BaseEntitySchema" }],
  required: ["name", "username", "userId"],
  properties: {
    name: {
      type: "object",
      required: ["first", "last"],
      properties: {
        first: {
          type: "string",
        },
        last: {
          type: "string",
        },
        preferred: {
          type: "string",
        },
      },
    },
    username: {
      type: "string",
    },
    userId: {
      type: "object",
      properties: {
        $oid: { type: "string" },
      },
    },
    avatarUrl: {
      type: "string",
    },
  },
};

export default ProfileSchema;
