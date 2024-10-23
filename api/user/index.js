import { generate, count } from "random-words";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export default async function (app) {
  app.get("/", async (req, res) => {
    return res.status(200).type("json").send("Hello, World!");
  });

  app.get("/register", async (req, res) => {
    const user = await prisma.user.create({
      data: {
        email: generate(),
      },
    });

    return user;
  });
}
