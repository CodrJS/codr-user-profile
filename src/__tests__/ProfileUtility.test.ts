import { Types as CodrTypes, User, Profile } from "@codrjs/models";
import jwt from "jsonwebtoken";
import { ProfileUtility } from "@/utils/ProfileUtility";
import { Types } from "mongoose";
import Mongo from "@/utils/Mongo";
import { Documents } from "@codrjs/mongo";
import Config from "@codrjs/config";

// const testSystemUser: IUser = {
//   _id: new Types.ObjectId(0),
//   type: "member",
//   email: "system",
//   role: "codr:system",
//   flags: {
//     isDeleted: false,
//     isDisabled: false,
//     isAnonymous: false,
//   },
// };

// const testAdminUser: IUser = {
//   _id: new Types.ObjectId(1),
//   type: "member",
//   email: "admin",
//   role: "codr:admin",
//   flags: {
//     isDeleted: false,
//     isDisabled: false,
//     isAnonymous: false,
//   },
// };

// const testResearchUser: IUser = {
//   _id: new Types.ObjectId(2),
//   type: "member",
//   email: "researcher",
//   role: "codr:researcher",
//   flags: {
//     isDeleted: false,
//     isDisabled: false,
//     isAnonymous: false,
//   },
// };

// const testAnnotatorUser: IUser = {
//   _id: new Types.ObjectId(3),
//   type: "member",
//   email: "annotator",
//   role: "codr:annotator",
//   flags: {
//     isDeleted: false,
//     isDisabled: false,
//     isAnonymous: false,
//   },
// };

// const testSystemProfile: IProfile = {
//   _id: new Types.ObjectId(0),
//   userId: testSystemUser._id as Types.ObjectId,
//   name: {
//     first: "Codr",
//     last: "System",
//     preferred: "System",
//   },
//   username: "System",
// };

// const testAdminProfile: IProfile = {
//   _id: new Types.ObjectId(1),
//   userId: testAdminUser._id as Types.ObjectId,
//   name: {
//     first: "Admin",
//     last: "User",
//     preferred: "Admin",
//   },
//   username: "Admin",
// };

// const testResearchProfile: IProfile = {
//   _id: new Types.ObjectId(2),
//   userId: testResearchUser._id as Types.ObjectId,
//   name: {
//     first: "Researcher",
//     last: "User",
//     preferred: "Researcher",
//   },
//   username: "Researcher",
// };

// const testAnnotatorProfile: IProfile = {
//   _id: new Types.ObjectId(3),
//   userId: testAnnotatorUser._id as Types.ObjectId,
//   name: {
//     first: "Annotator",
//     last: "User",
//     preferred: "Annotator",
//   },
//   username: "Annotator",
// };

// const demoNewProfile: IProfile = {
//   _id: new Types.ObjectId(4),
//   userId: new Types.ObjectId(10),
//   name: {
//     first: "New",
//     last: "User",
//   },
//   username: "NewUser",
// };

const generateUser = (
  type: CodrTypes.UserEnum,
  role: CodrTypes.UserRoleEnum,
  createdBy: Types.ObjectId
): User => {
  const userId = new Types.ObjectId();
  return new User({
    _id: userId,
    email: `demouser+${userId}@codrjs.com`,
    role,
    type,
    flags: {
      isDeleted: false,
      isDisabled: false,
      isAnonymous: true,
    },
    createdBy,
  });
};

const generateProfile = (
  userId: Types.ObjectId,
  createdBy: Types.ObjectId
): Profile => {
  return new Profile({
    name: {
      first: "Test",
      last: "User",
    },
    userId,
    username: `TestUser+${userId}`,
    _id: userId,
    createdBy,
  });
};

const generateUserJwt = (user: User) => {
  return jwt.decode(
    jwt.sign(user.toJSON(), Config.jwt.secret, {
      issuer: Config.jwt.issuer,
      algorithm: <jwt.Algorithm>Config.jwt.algorithm,
      subject: user._id.toString(),
      expiresIn: "1h",
      jwtid: new Types.ObjectId().toString(),
    })
  ) as CodrTypes.JwtPayload;
};

describe("Profile Utility", () => {
  let Utility: ProfileUtility;
  let SystemUser: {
    Class: Profile;
    Payload: CodrTypes.JwtPayload;
  };
  let AdminUser: {
    Class: Profile;
    Payload: CodrTypes.JwtPayload;
  };
  let ResearchUser: {
    Class: Profile;
    Payload: CodrTypes.JwtPayload;
  };
  let AnnotatorUser: {
    Class: Profile;
    Payload: CodrTypes.JwtPayload;
  };

  beforeAll(async () => {
    // connect to mongo
    await Mongo.connect();

    const MongoUser = Mongo.User.User;
    const MongoProfile = Mongo.User.Profile;
    Utility = new ProfileUtility();

    // get user documents
    const sysUser = new User(
      (await MongoUser.findOne({
        email: "system@codrjs.com",
      })) as Documents.UserDocument
    );
    const adminUser = new User(
      (await MongoUser.findOne({
        role: CodrTypes.UserRoleEnum.ADMIN,
      })) as Documents.UserDocument
    );

    SystemUser = {
      Class: new Profile(
        (await MongoProfile.findOne({
          userId: sysUser._id,
        })) as Documents.ProfileDocument
      ),
      Payload: generateUserJwt(sysUser),
    };

    AdminUser = {
      Class: new Profile(
        (await MongoProfile.findOne({
          userId: adminUser._id,
        })) as Documents.ProfileDocument
      ),
      Payload: generateUserJwt(adminUser),
    };

    // AnnotatorUser = {
    //   Class: annotator,
    //   Payload: generateUserJwt(annotator),
    // };
  });

  afterAll(async () => {
    await Mongo.close();
  });

  describe("Create: Profile", () => {
    test("System can add profile", async () => {
      // run tests
      const genProf = generateProfile(
        new Types.ObjectId(),
        new Types.ObjectId(SystemUser.Payload.sub)
      );
      const profile = await Utility.create(SystemUser.Payload, genProf);
      expect(profile.details.profile.username).toBe(genProf.username);
    });

    test("Admin can add profile", async () => {
      // run tests
      const genProf = generateProfile(
        new Types.ObjectId(),
        new Types.ObjectId(AdminUser.Payload.sub)
      );
      const profile = await Utility.create(AdminUser.Payload, genProf);
      expect(profile.details.profile.username).toBe(genProf.username);
    });

    // test("Researcher cannot add profile", () => {
    //   // mock function returns once

    //   // run tests
    //   expect(Utility.create(testResearchUser, demoNewProfile)).rejects.toEqual(
    //     new Error({
    //       status: 403,
    //       message: "User is forbidden from creating profiles.",
    //     })
    //   );
    // });

    // test("Annotator cannot add profile", () => {
    //   // mock function returns once

    //   // run tests
    //   expect(Utility.create(testAnnotatorUser, demoNewProfile)).rejects.toEqual(
    //     new Error({
    //       status: 403,
    //       message: "User is forbidden from creating profiles.",
    //     })
    //   );
    // });
  });

  // describe("Read: Profile", () => {
  //   test("System can read another profile", async () => {
  //     // mock function returns once
  //     Profile.findById = jest.fn().mockResolvedValueOnce(demoNewProfile);

  //     // run tests
  //     const profile = await Utility.get(
  //       testSystemUser,
  //       demoNewProfile._id as unknown as string
  //     );
  //     expect(profile.details.profile.username).toBe("NewUser");
  //   });

  //   test("Admin can read another profile", async () => {
  //     // mock function returns once
  //     Profile.findById = jest.fn().mockResolvedValueOnce(demoNewProfile);

  //     // run tests
  //     const profile = await Utility.get(
  //       testAdminUser,
  //       demoNewProfile._id as unknown as string
  //     );
  //     expect(profile.details.profile.username).toBe("NewUser");
  //   });

  //   test("Researcher can read another profile", async () => {
  //     // mock function returns once
  //     Profile.findById = jest.fn().mockResolvedValueOnce(demoNewProfile);

  //     // run tests
  //     const profile = await Utility.get(
  //       testAdminUser,
  //       demoNewProfile._id as unknown as string
  //     );
  //     expect(profile.details.profile.username).toEqual(demoNewProfile.username);
  //   });

  //   test("Annotator can read another profile", async () => {
  //     // mock function returns once
  //     Profile.findById = jest.fn().mockResolvedValueOnce(demoNewProfile);

  //     // run tests
  //     const profile = await Utility.get(
  //       testAnnotatorUser,
  //       demoNewProfile._id as unknown as string
  //     );
  //     expect(profile.details.profile.username).toEqual(demoNewProfile.username);
  //   });
  // });

  // describe("Update: Profile", () => {
  //   test("System can update another profile", async () => {
  //     // mock function returns once
  //     Profile.findById = jest.fn().mockResolvedValueOnce(demoNewProfile);
  //     Profile.findByIdAndUpdate = jest
  //       .fn()
  //       .mockResolvedValueOnce(demoNewProfile);

  //     // run tests
  //     const profile = await Utility.update(
  //       testSystemUser,
  //       demoNewProfile._id as unknown as string,
  //       demoNewProfile
  //     );
  //     expect(profile.details.profile.username).toBe("NewUser");
  //   });

  //   test("System cannot update system profile", async () => {
  //     // mock function returns once
  //     Profile.findById = jest.fn().mockResolvedValueOnce(testSystemProfile);

  //     // run tests
  //     expect(
  //       Utility.update(
  //         testSystemUser,
  //         testSystemProfile._id as unknown as string,
  //         testSystemProfile
  //       )
  //     ).rejects.toEqual(
  //       new Error({
  //         status: 403,
  //         message: "User is forbidden from updating this profile.",
  //       })
  //     );
  //   });

  //   test("Admin can update another profile", async () => {
  //     // mock function returns once
  //     Profile.findById = jest.fn().mockResolvedValueOnce(testAdminProfile);
  //     Profile.findByIdAndUpdate = jest
  //       .fn()
  //       .mockResolvedValueOnce(demoNewProfile);

  //     // run tests
  //     const profile = await Utility.update(
  //       testAdminUser,
  //       demoNewProfile._id as unknown as string,
  //       demoNewProfile
  //     );
  //     expect(profile.details.profile.username).toBe("NewUser");
  //   });

  //   test("Admin cannot update system profile", async () => {
  //     // mock function returns once
  //     Profile.findById = jest.fn().mockResolvedValueOnce(testSystemProfile);

  //     // run tests
  //     expect(
  //       Utility.update(
  //         testResearchUser,
  //         testSystemProfile._id as unknown as string,
  //         testSystemProfile
  //       )
  //     ).rejects.toEqual(
  //       new Error({
  //         status: 403,
  //         message: "User is forbidden from updating this profile.",
  //       })
  //     );
  //   });

  //   test("Researcher cannot update profiles", async () => {
  //     // mock function returns once
  //     Profile.findById = jest.fn().mockResolvedValueOnce(demoNewProfile);

  //     // run tests
  //     expect(
  //       Utility.update(
  //         testResearchUser,
  //         demoNewProfile._id as unknown as string,
  //         demoNewProfile
  //       )
  //     ).rejects.toEqual(
  //       new Error({
  //         status: 403,
  //         message: "User is forbidden from updating this profile.",
  //       })
  //     );
  //   });

  //   test("Annotator cannot update profiles", async () => {
  //     // mock function returns once
  //     Profile.findById = jest.fn().mockResolvedValueOnce(demoNewProfile);

  //     // run tests
  //     expect(
  //       Utility.update(
  //         testAnnotatorUser,
  //         demoNewProfile._id as unknown as string,
  //         demoNewProfile
  //       )
  //     ).rejects.toEqual(
  //       new Error({
  //         status: 403,
  //         message: "User is forbidden from updating this profile.",
  //       })
  //     );
  //   });

  //   test("Researcher can update own profile", async () => {
  //     // mock function returns once
  //     Profile.findById = jest.fn().mockResolvedValueOnce(testResearchProfile);
  //     Profile.findByIdAndUpdate = jest
  //       .fn()
  //       .mockResolvedValueOnce(testResearchProfile);

  //     // run tests
  //     const profile = await Utility.update(
  //       testResearchUser,
  //       testResearchProfile._id as unknown as string,
  //       testResearchProfile
  //     );
  //     expect(profile.details.profile.username).toBe("Researcher");
  //   });
  // });
});

/**
 * @TODO Add test cases for (soft) deleting a profile.
 */
