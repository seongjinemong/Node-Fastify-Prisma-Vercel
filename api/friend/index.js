import { getFriend, addFriend, removeFriend } from "./friend.ctrl.js";

export default async function (app) {

  // * getFriend
  app.get("/", getFriend);

  // * addFriend
  app.post("/add", addFriend);

  // * removeFriend
  app.post("/remove", removeFriend);
}
