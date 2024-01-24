const supertest = require("supertest");
const { http, HttpResponse } = require("msw");
const { setupServer } = require("msw/node");

let server;

beforeAll(() => {
  server = setupServer(
    http.get("http://localhost/json-example", () => {
      return HttpResponse.json({ foo: "bar" });
    })
  );

  // Enable API mocking before all the tests.
  server.listen();
});

afterEach(() => {
  // Reset the request handlers between each test.
  // This way the handlers we add on a per-test basis
  // do not leak to other, irrelevant tests.
  server.resetHandlers();
});

afterAll(() => {
  // Finally, disable API mocking after the tests are done.
  server.close();
});

test("normal json response", async () => {
  await supertest("http://localhost").get("/json-example").expect(200);
});
