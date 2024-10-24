import Fastify from "fastify";
import fasifyCors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
//import fastifySession from "@fastify/session";
import PrismaStore from "@mgcrea/fastify-session-prisma-store";
import fastifySession from "@mgcrea/fastify-session";
import prisma from "./lib/db.js";

const app = Fastify({
  logger: true,
});

// * Add plugins for cors
app.register(fasifyCors, {
  origin: (origin, callback) => {
    if (
      !origin ||
      origin.startsWith("http://localhost") ||
      origin.startsWith("https://timetable.seongjinemong.app")
    ) {
      callback(null, true); // 모든 localhost 출처 허용
    } else {
      callback(new Error("Not allowed"), false); // 그 외 출처는 허용하지 않음
    }
  },
  credentials: true, // Allow credentials
});

// * Add plugins for request or response
//app.register(import("./plugins/greeting.js"));

// * Add plugins for cookie
app.register(fastifyCookie);

// * Add plugins for session
app.register(fastifySession, {
  store: new PrismaStore({ prisma }),
  secret: process.env.SESSION_SECRET,
  cookieName: "sessionId",
  saveUninitialized: false,
  cookie: {
    secure: false,
  },
});

app.get("/", (req, res) => {
  return res
    .status(200)
    .send("TimeTable API with Vercel, Fastify by Seongjinemong ><");
});

app.register(import("./user/index.js"), { prefix: "/user" });

export default async function handler(req, res) {
  // Explicitly type parameters
  await app.ready();
  app.server.emit("request", req, res);
}
