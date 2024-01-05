const supertest = require("supertest");
const { http, HttpResponse } = require("msw");
const { setupServer } = require("msw/node");

test("normal json response", async () => {
  // Provide the server-side API with the request handlers.
  const server = setupServer(
    http.get("http://localhost/json-example", () => {
      return HttpResponse.json({ foo: "bar" });
    })
  );

  // Start the interception.
  server.listen();

  await supertest("http://localhost").get("/json-example").expect(200);
});
