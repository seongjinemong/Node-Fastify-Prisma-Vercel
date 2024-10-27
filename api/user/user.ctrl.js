import prisma from "../lib/db.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client();

// * Login
async function login(req, res) {
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
    //console.log("Attempting to find user...");
    user = await prisma.user.findFirst({
      where: { email: ticket.getPayload().email },
    });
    //console.log("User found:", user);
  } catch (error) {
    //console.error("Error finding user:", error);
    return res
      .status(500)
      .type("json")
      .send("Internal Server Error while finding user");
  }

  if (user.active === false) {
    // set user active to true
    try {
      await prisma.user.update({
        where: { email: ticket.getPayload().email },
        data: { active: true },
      });
    } catch (error) {
      return res.status(500).type("json").send("Error reactivating user");
    }
  }

  // if not found, create user
  if (!user) {
    try {
      //console.log("Creating new user...");
      user = await prisma.user.create({
        data: { email: ticket.getPayload().email },
      });
      //console.log("New user created:", user);
    } catch (error) {
      //console.error("Error creating user:", error);
      return res
        .status(500)
        .type("json")
        .send("Internal Server Error while creating user");
    }
  }

  // Add user.email to session
  req.session.user = user.email;

  // return user
  return res.status(200).type("json").send(user);
}

async function logout(req, res) {
  if (!req.session.authenticated) {
    return res.status(401).type("json").send("Not logged in");
  }

  req.session.destroy();
  return res.status(200).type("json").send("Logged out");
}

async function profile(req, res) {
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
      .send("Not registered, please let manager know");
  }

  // return user profile
  return res.status(200).type("json").send(user);
}

async function setSummary(req, res) {
  // Check if user is authenticated
  if (!req.session.authenticated) {
    return res.status(401).type("json").send("Unauthorized");
  }

  const { summary } = req.body;

  let user;
  try {
    user = await prisma.user.update({
      where: { email: req.session.user },
      data: { summary: summary },
    });
  } catch (error) {
    return res.status(500).type("json").send("Internal Server Error");
  }

  return res.status(200).type("json").send(user);
}

async function deleteUser(req, res) {
  // Check if user is authenticated
  if (!req.session.authenticated) {
    return res.status(401).type("json").send("Unauthorized");
  }

  // set user active to false
  try {
    await prisma.user.update({
      where: { email: req.session.user },
      data: { active: false },
    });
  } catch (error) {
    return res
      .status(500)
      .type("json")
      .send("Internal Server Error while deleting user");
  }

  req.session.destroy();

  return res.status(200).type("json").send("User deleted");
}

export { login, logout, profile, setSummary, deleteUser };