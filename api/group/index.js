import {
  getGroup,
  getGroupwithId,
  addFriendtoGroupwithId,
  removeFriendfromGroupwithId,
} from "./group.ctrl.js";

export default async function (app) {
  // * getGroup
  app.get("/", getGroup);

  // * getGroupwithId
  app.get("/:id", getGroupwithId);

  // * addFriendtoGroupwithId
  app.get("/:id/addfriend", addFriendtoGroupwithId);

  // * removeFriendfromGroupwithId
  app.get("/:id/removefriend", removeFriendfromGroupwithId);
}
