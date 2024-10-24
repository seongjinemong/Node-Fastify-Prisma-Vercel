import prisma from "../lib/db.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client();

export default async function (app) {
  app.get("/", async (req, res) => {
    return res.status(200).type("json").send("/user invoked!");
  });

  // * Login
  app.post("/login", async (req, res) => {
    const { credential, clientId } = req.body;

    let ticket;
    try {
      // verify id token
      ticket = await client.verifyIdToken({
        idToken: credential,
        audience: clientId,
      });
    } catch (error) {
      return res.status(401).type("json").send("Unauthorized");
    }

    // make session authenticated
    req.session.authenticated = true;

    // find user
    let user;
    try {
      console.log("Attempting to find user...");
      user = await prisma.user.findFirst({
        where: { email: ticket.getPayload().email },
      });
      console.log("User found:", user);
    } catch (error) {
      console.error("Error finding user:", error);
      return res.status(500).type("json").send("Internal Server Error");
    }

    // if not found, create user
    if (!user) {
      try {
        console.log("Creating new user...");
        user = await prisma.user.create({
          data: { email: ticket.getPayload().email },
        });
        console.log("New user created:", user);
      } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).type("json").send("Internal Server Error");
      }
    }

    // Add user.email to session
    req.session.user = user.email;

    // return user
    return res.status(200).type("json").send(user);
  });
  // * Logout
  app.get("/logout", async (req, res) => {
    req.session.destroy();
    return res.status(200).type("json").send("Logged out");
  });

  // * Profile
  app.get("/profile", async (req, res) => {
    // Check if user is authenticated
    if (!req.session.authenticated) {
      return res.status(401).type("json").send("Unauthorized");
    }

    let user;

    try {
      // Get user profile
      user = await prisma.user.findFirst({
        where: {
          email: req.session.user,
        },
      });
    } catch (error) {
      return res
        .status(401)
        .type("json")
        .send("Not registered, please let me know");
    }

    // return user profile
    return res.status(200).type("json").send(user);
  });
}
