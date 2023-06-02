import { subject } from "@casl/ability";
import {
  Profile,
  IProfile,
  Utility,
  Error,
  Response,
  Types as CodrTypes,
} from "@codrjs/models";
import MongoProfile, { ProfileDocument } from "@/entities/Profile";
import ProfileAbility from "@/entities/Profile.ability";
import { Types } from "mongoose";

type JwtPayload = CodrTypes.JwtPayload;

export class ProfileUtility extends Utility {
  // an internal method for getting the desired document to check against permissions
  protected async _getDocument<T>(id: string) {
    try {
      return (await MongoProfile.findById(id)) as T;
    } catch (err) {
      throw new Error({
        status: 500,
        message: "Something went wrong when fetching profile",
        details: {
          profileId: id,
          error: err,
        },
      });
    }
  }

  private async _getDocumentByUserId<T>(userId: Types.ObjectId) {
    try {
      return (await MongoProfile.findOne({ userId })) as T;
    } catch (err) {
      throw new Error({
        status: 500,
        message: "Something went wrong when fetching profile",
        details: {
          userId,
          error: err,
        },
      });
    }
  }

  async get(token: JwtPayload, id: string) {
    // get desired profile document
    const profile = await this._getDocument<ProfileDocument>(id);

    // if profile and read the document, send it, else throw error
    if (ProfileAbility(token).can("read", subject("Profile", profile))) {
      return new Response({
        message: "OK",
        details: {
          profile: new Profile(profile),
        },
      });
    } else {
      throw new Error({
        status: 403,
        message: "User is forbidden from reading this profile.",
      });
    }
  }

  async getByUIserId(token: JwtPayload, userId: Types.ObjectId) {
    // get desired user document
    const profile = await this._getDocumentByUserId<ProfileDocument>(userId);

    // if user and read the document, send it, else throw error
    if (ProfileAbility(token).can("read", subject("Profile", profile))) {
      return new Response({
        message: "OK",
        details: {
          profile: new Profile(profile),
        },
      });
    } else {
      throw new Error({
        status: 403,
        message: "User is forbidden from reading this profile.",
      });
    }
  }

  async create(token: JwtPayload, obj: IProfile) {
    // if profile can create profiles
    if (ProfileAbility(token).can("create", "Profile")) {
      try {
        // create profile
        const profile = await MongoProfile.create(obj);
        return new Response({
          message: "OK",
          details: {
            profile: new Profile(profile),
          },
        });
      } catch (e) {
        throw new Error({
          status: 500,
          message:
            "An unexpected error occurred when trying to create a profile.",
          details: e,
        });
      }
    } else {
      throw new Error({
        status: 403,
        message: "User is forbidden from creating profiles.",
      });
    }
  }

  async update(token: JwtPayload, id: string, obj: Partial<IProfile>) {
    // get desired profile document
    const profile = await this._getDocument<ProfileDocument>(id);

    // check permissions
    if (ProfileAbility(token).can("update", subject("Profile", profile))) {
      try {
        // update profile.
        const profile = (await MongoProfile.findByIdAndUpdate(id, obj, {
          returnDocument: "after",
        })) as ProfileDocument;

        // return true if succeeded, else throw error
        return new Response({
          message: "OK",
          details: {
            profile: new Profile(profile),
          },
        });
      } catch (e) {
        throw new Error({
          status: 500,
          message:
            "An unexpected error occurred when trying to update a profile.",
          details: e,
        });
      }
    } else {
      throw new Error({
        status: 403,
        message: "User is forbidden from updating this profile.",
      });
    }
  }

  /**
   * @todo Hard or soft delete profiles?
   */
  async delete(token: JwtPayload, id: string) {
    throw new Error({
      status: 500,
      message: "Method not implemented.",
    });

    // expected return???
    return new Response({
      message: "OK",
      details: {
        profile: undefined,
      },
    });
  }
}
