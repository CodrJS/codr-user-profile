import { MongoManager, Types } from "@codrjs/mongo";

const Mongo = new MongoManager([
  {
    name: Types.DatabaseEnum.USER,
    models: [Types.UserModelEnum.PROFILE],
  },
]);

export default Mongo;
