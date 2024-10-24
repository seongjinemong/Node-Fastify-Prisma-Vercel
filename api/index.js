import Fastify from "fastify";

const app = Fastify({
  logger: true,
});

// * Add plugins for cors
app.register(import("@fastify/cors"), {
  origin: ["http://localhost", "https://timetable.seongjinemong.app"],
});

// * Add plugins for request or response
//app.register(import("./plugins/greeting.js"));

// * Add plugins for cookie
app.register(import("@fastify/cookie"));

// * Add plugins for session
app.register(import("@fastify/session"), {
  secret: "ithinkthatforifisthebestclubinhyuorisit?",
  cookieName: "sessionId",
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
  await app.ready();
  app.server.emit("request", req, res);
}
