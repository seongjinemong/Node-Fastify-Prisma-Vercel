import Fastify from "fastify";

const app = Fastify({
  logger: true,
});

// * Add plugins for request or response
//app.register(import("./plugins/greeting.js"));

app.get("/", (req, res) => {
  return res
    .status(200)
    .send("TimeTable API with Vercel, Fastify, and Seongjinemong ><");
});

app.register(import("./user/index.js"), { prefix: "/user" });

export default async function handler(req, res) {
  await app.ready();
  app.server.emit("request", req, res);
}
