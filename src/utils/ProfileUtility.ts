import { Types as MongoTypes } from "mongoose";
import {
  Profile,
  IProfile,
  Utility,
  Error,
  Response,
  Types,
} from "@codrjs/models";
import { Abilities, Documents } from "@codrjs/mongo";
import Mongo from "./Mongo";

type Document = Documents.ProfileDocument;
type JwtPayload = Types.JwtPayload;

export class ProfileUtility extends Utility {
  private Profile;

  constructor() {
    super();
    this.Profile = Mongo.User.Profile;
  }

  // an internal method for getting the desired document to check against permissions
  protected async _getDocument<T>(id: string) {
    try {
      return (await this.Profile.findById(id)) as T;
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

  private async _getDocumentByUserId<T>(userId: MongoTypes.ObjectId) {
    try {
      return (await this.Profile.findOne({ userId })) as T;
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
    const profile = new Profile(await this._getDocument<Document>(id));

    // if profile and read the document, send it, else throw error
    if (Abilities.ProfileAbility(token).can("read", profile)) {
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

  async getByUserId(token: JwtPayload, userId: MongoTypes.ObjectId) {
    // get desired user document
    const profile = await this._getDocumentByUserId<Document>(userId);

    // if user and read the document, send it, else throw error
    if (Abilities.ProfileAbility(token).can("read", profile)) {
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

  async create(token: JwtPayload, obj: Profile) {
    // if profile can create profiles
    if (Abilities.ProfileAbility(token).can("create", obj)) {
      try {
        // create profile
        const profile = await this.Profile.create(obj.toJSON());
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
    const profile = new Profile(await this._getDocument<Document>(id));

    // check permissions
    if (Abilities.ProfileAbility(token).can("update", profile)) {
      try {
        // update profile.
        const updatedProfile = (await this.Profile.findByIdAndUpdate(id, obj, {
          returnDocument: "after",
        })) as Document;

        // return true if succeeded, else throw error
        return new Response({
          message: "OK",
          details: {
            profile: new Profile(updatedProfile),
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
