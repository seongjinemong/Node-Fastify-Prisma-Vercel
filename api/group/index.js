import {
  getGroup,
  getGroupwithId,
  newGroup,
  addFriendtoGroupwithId,
  removeFriendfromGroupwithId,
  deleteGroupwithId,
} from "./group.ctrl.js";

export default async function (app) {
  // * getGroup
  app.get("/", getGroup);

  // * getGroupwithId
  app.get("/:id", getGroupwithId);

  // * newGroup
  app.post("/new", newGroup);

  // * addFriendtoGroupwithId
  app.post("/:id/addfriend", addFriendtoGroupwithId);

  // * removeFriendfromGroupwithId
  app.post("/:id/removefriend", removeFriendfromGroupwithId);

  // * deleteGroupwithId
  app.delete("/:id", deleteGroupwithId);
}
