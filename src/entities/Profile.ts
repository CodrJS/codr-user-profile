import { IProfile } from "@codrjs/models";
import { model, Schema, SchemaTypes } from "mongoose";
import {
  AccessibleFieldsModel,
  accessibleFieldsPlugin,
  AccessibleModel,
  accessibleRecordsPlugin,
} from "@casl/mongoose";

export type ProfileDocument = IProfile & AccessibleFieldsModel<IProfile>;
const ProfileSchema = new Schema<IProfile>(
  {
    avatarUrl: String,
    userId: {
      type: SchemaTypes.ObjectId,
      required: true,
      unique: true,
      index: true,
      ref: "User",
    },
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: {
        first: String,
        last: String,
        preferred: String,
      },
      required: true,
    },
    createdAt: String,
    updatedAt: String,
  },
  {
    timestamps: true,
  }
);

// exports Profile model.
ProfileSchema.plugin(accessibleFieldsPlugin);
ProfileSchema.plugin(accessibleRecordsPlugin);
const Profile = model<IProfile, AccessibleModel<ProfileDocument>>(
  "Profile",
  ProfileSchema
);
export default Profile;
