import { generate, count } from "random-words";
import { PrismaClient, Prisma } from "@prisma/client";
import { OAuth2Client } from "google-auth-library";

const prisma = new PrismaClient();
const client = new OAuth2Client();

export default async function (app) {
  app.get("/", async (req, res) => {
    return res.status(200).type("json").send("/user invoked!");
  });

  // * Login
  app.post("/login", async (req, res) => {
    const { credential, client_id } = request.body;

    try {
      // verify id token
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: client_id,
      });

      // make session authenticated
      req.session.authenticated = true;

      // get user from database
      let user = await prisma.user.findFirst({
        where: {
          email: ticket.getPayload().email,
        },
      });

      // Add user.email to session
      req.session.user = user.email;

      // if user is not in database, create user
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: ticket.getPayload().email,
          },
        });
      }

      // return user
      return res.status(200).type("json").send(user);
    } catch (error) {
      return res.status(401).type("json").send("Unauthorized");
    }
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

    // Get user profile
    const user = await prisma.user.findFirst({
      where: {
        email: req.session.user,
      },
    });

    // Check if user is registered
    if (!user) {
      return res.status(401).type("json").send("Not registered, please let me know");
    }

    // return user profile
    return res.status(200).type("json").send(user);
  });
}
