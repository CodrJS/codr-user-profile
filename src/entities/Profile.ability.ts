import { Types, IUser } from "@codrjs/models";
import { ProfileDocument } from "./Profile";

const permissions: Types.Permissions<ProfileDocument, "Profile"> = {
  "codr:system": (_user, { can, cannot }) => {
    can("manage", "Profile");
    cannot("update", "Profile", { role: { $eq: "codr:system" } });
    cannot("delete", "Profile", { role: { $eq: "codr:system" } });
  },
  "codr:admin": (_user, { can, cannot }) => {
    can("manage", "Profile");
    cannot("update", "Profile", { role: { $eq: "codr:system" } });
    cannot("delete", "Profile", { role: { $eq: "codr:system" } });
  },
  "codr:researcher": (user, { can }) => {
    // can read all profiles and update it's own
    can("read", "Profile");
    can("update", "Profile", { userId: user._id });
  },
  "codr:annotator": (_user, { can }) => {
    // can only read profiles
    can("read", "Profile");
  },
};

const ProfileAbility = (user: IUser) => Types.DefineAbility(user, permissions);
export default ProfileAbility;
