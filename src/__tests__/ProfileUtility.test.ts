import { Error, IProfile, IUser } from "@codrjs/models";
import { ProfileUtility } from "@/utils/ProfileUtility";
import { Types } from "mongoose";
import Profile from "@/entities/Profile";
const Utility = new ProfileUtility();

const testSystemUser: IUser = {
  _id: new Types.ObjectId(0),
  type: "member",
  email: "system",
  role: "codr:system",
  flags: {
    isDeleted: false,
    isDisabled: false,
    isAnonymous: false,
  },
};

const testAdminUser: IUser = {
  _id: new Types.ObjectId(1),
  type: "member",
  email: "admin",
  role: "codr:admin",
  flags: {
    isDeleted: false,
    isDisabled: false,
    isAnonymous: false,
  },
};

const testResearchUser: IUser = {
  _id: new Types.ObjectId(2),
  type: "member",
  email: "researcher",
  role: "codr:researcher",
  flags: {
    isDeleted: false,
    isDisabled: false,
    isAnonymous: false,
  },
};

const testAnnotatorUser: IUser = {
  _id: new Types.ObjectId(3),
  type: "member",
  email: "annotator",
  role: "codr:annotator",
  flags: {
    isDeleted: false,
    isDisabled: false,
    isAnonymous: false,
  },
};

const testSystemProfile: IProfile = {
  _id: new Types.ObjectId(0),
  userId: testSystemUser._id as Types.ObjectId,
  name: {
    first: "Codr",
    last: "System",
    preferred: "System",
  },
  username: "System",
};

const testAdminProfile: IProfile = {
  _id: new Types.ObjectId(1),
  userId: testAdminUser._id as Types.ObjectId,
  name: {
    first: "Admin",
    last: "User",
    preferred: "Admin",
  },
  username: "Admin",
};

const testResearchProfile: IProfile = {
  _id: new Types.ObjectId(2),
  userId: testResearchUser._id as Types.ObjectId,
  name: {
    first: "Researcher",
    last: "User",
    preferred: "Researcher",
  },
  username: "Researcher",
};

const testAnnotatorProfile: IProfile = {
  _id: new Types.ObjectId(3),
  userId: testAnnotatorUser._id as Types.ObjectId,
  name: {
    first: "Annotator",
    last: "User",
    preferred: "Annotator",
  },
  username: "Annotator",
};

const demoNewProfile: IProfile = {
  _id: new Types.ObjectId(4),
  userId: new Types.ObjectId(10),
  name: {
    first: "New",
    last: "User",
    preferred: "New",
  },
  username: "NewUser",
};

describe("Profile Utility: Create", () => {
  test("System can add profile", async () => {
    // mock function returns once
    Profile.findById = jest.fn().mockResolvedValueOnce(testSystemProfile);
    Profile.create = jest.fn().mockResolvedValueOnce(demoNewProfile);

    // run tests
    const profile = await Utility.create(testSystemUser, demoNewProfile);
    expect(profile.details.profile.username).toBe("NewUser");
  });

  test("Admin can add profile", async () => {
    // mock function returns once
    Profile.findById = jest.fn().mockResolvedValueOnce(testAdminProfile);
    Profile.create = jest.fn().mockResolvedValueOnce(demoNewProfile);

    // run tests
    const profile = await Utility.create(testAdminUser, demoNewProfile);
    expect(profile.details.profile.username).toBe("NewUser");
  });

  test("Researcher cannot add profile", () => {
    // mock function returns once
    Profile.findById = jest.fn().mockResolvedValueOnce(testResearchProfile);
    Profile.create = jest.fn().mockResolvedValueOnce(demoNewProfile);

    // run tests
    expect(Utility.create(testResearchUser, demoNewProfile)).rejects.toEqual(
      new Error({
        status: 403,
        message: "User is forbidden from creating profiles.",
      })
    );
  });

  test("Annotator cannot add profile", () => {
    // mock function returns once
    Profile.findById = jest.fn().mockResolvedValueOnce(testAnnotatorProfile);
    Profile.create = jest.fn().mockResolvedValueOnce(demoNewProfile);

    // run tests
    expect(Utility.create(testAnnotatorUser, demoNewProfile)).rejects.toEqual(
      new Error({
        status: 403,
        message: "User is forbidden from creating profiles.",
      })
    );
  });
});

describe("Profile Utility: Read", () => {
  test("System can read another profile", async () => {
    // mock function returns once
    Profile.findById = jest.fn().mockResolvedValueOnce(demoNewProfile);

    // run tests
    const profile = await Utility.get(
      testSystemUser,
      demoNewProfile._id as unknown as string
    );
    expect(profile.details.profile.username).toBe("NewUser");
  });

  test("Admin can read another profile", async () => {
    // mock function returns once
    Profile.findById = jest.fn().mockResolvedValueOnce(demoNewProfile);

    // run tests
    const profile = await Utility.get(
      testAdminUser,
      demoNewProfile._id as unknown as string
    );
    expect(profile.details.profile.username).toBe("NewUser");
  });

  test("Researcher can read another profile", async () => {
    // mock function returns once
    Profile.findById = jest.fn().mockResolvedValueOnce(demoNewProfile);

    // run tests
    const profile = await Utility.get(
      testAdminUser,
      demoNewProfile._id as unknown as string
    );
    expect(profile.details.profile.username).toEqual(demoNewProfile.username);
  });

  test("Annotator can read another profile", async () => {
    // mock function returns once
    Profile.findById = jest.fn().mockResolvedValueOnce(demoNewProfile);

    // run tests
    const profile = await Utility.get(
      testAnnotatorUser,
      demoNewProfile._id as unknown as string
    );
    expect(profile.details.profile.username).toEqual(demoNewProfile.username);
  });
});

describe("Profile Utility: Update", () => {
  test("System can update another profile", async () => {
    // mock function returns once
    Profile.findById = jest.fn().mockResolvedValueOnce(demoNewProfile);
    Profile.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(demoNewProfile);

    // run tests
    const profile = await Utility.update(
      testSystemUser,
      demoNewProfile._id as unknown as string,
      demoNewProfile
    );
    expect(profile.details.profile.username).toBe("NewUser");
  });

  test("System cannot update system profile", async () => {
    // mock function returns once
    Profile.findById = jest.fn().mockResolvedValueOnce(testSystemProfile);

    // run tests
    expect(
      Utility.update(
        testSystemUser,
        testSystemProfile._id as unknown as string,
        testSystemProfile
      )
    ).rejects.toEqual(
      new Error({
        status: 403,
        message: "User is forbidden from updating this profile.",
      })
    );
  });

  test("Admin can update another profile", async () => {
    // mock function returns once
    Profile.findById = jest.fn().mockResolvedValueOnce(testAdminProfile);
    Profile.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(demoNewProfile);

    // run tests
    const profile = await Utility.update(
      testAdminUser,
      demoNewProfile._id as unknown as string,
      demoNewProfile
    );
    expect(profile.details.profile.username).toBe("NewUser");
  });

  test("Admin cannot update system profile", async () => {
    // mock function returns once
    Profile.findById = jest.fn().mockResolvedValueOnce(testSystemProfile);

    // run tests
    expect(
      Utility.update(
        testResearchUser,
        testSystemProfile._id as unknown as string,
        testSystemProfile
      )
    ).rejects.toEqual(
      new Error({
        status: 403,
        message: "User is forbidden from updating this profile.",
      })
    );
  });

  test("Researcher cannot update profiles", async () => {
    // mock function returns once
    Profile.findById = jest.fn().mockResolvedValueOnce(demoNewProfile);

    // run tests
    expect(
      Utility.update(
        testResearchUser,
        demoNewProfile._id as unknown as string,
        demoNewProfile
      )
    ).rejects.toEqual(
      new Error({
        status: 403,
        message: "User is forbidden from updating this profile.",
      })
    );
  });

  test("Annotator cannot update profiles", async () => {
    // mock function returns once
    Profile.findById = jest.fn().mockResolvedValueOnce(demoNewProfile);

    // run tests
    expect(
      Utility.update(
        testAnnotatorUser,
        demoNewProfile._id as unknown as string,
        demoNewProfile
      )
    ).rejects.toEqual(
      new Error({
        status: 403,
        message: "User is forbidden from updating this profile.",
      })
    );
  });

  test("Researcher can update own profile", async () => {
    // mock function returns once
    Profile.findById = jest.fn().mockResolvedValueOnce(testResearchProfile);
    Profile.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(testResearchProfile);

    // run tests
    const profile = await Utility.update(
      testResearchUser,
      testResearchProfile._id as unknown as string,
      testResearchProfile
    );
    expect(profile.details.profile.username).toBe("Researcher");
  });
});

/**
 * @TODO Add test cases for (soft) deleting a profile.
 */
