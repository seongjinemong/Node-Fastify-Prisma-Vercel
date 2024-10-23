import fp from "fastify-plugin";

export default fp(async function (app) {
  app.decorateRequest("greeting", "hello");
  app.decorateRequest("name", "Jake");
});
