import { login, logout, profile } from "./user.ctrl.js";

export default async function (app) {
  app.get("/", async (req, res) => {
    return res.status(200).type("json").send("/user invoked!");
  });

  // * Login
  app.post("/login", login);

  // * Logout
  app.get("/logout", logout);

  // * Profile
  app.get("/profile", profile);
}
