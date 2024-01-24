const supertest = require("supertest");
const { http, HttpResponse } = require("msw");
const { setupServer } = require("msw/node");

const encoder = new TextEncoder();

let server;

beforeAll(() => {
  server = setupServer(
    http.get("http://localhost/video", () => {
      const stream = new ReadableStream({
        start(controller) {
          // Encode the string chunks using "TextEncoder".
          controller.enqueue(encoder.encode("Brand"));
          controller.enqueue(encoder.encode("New"));
          controller.enqueue(encoder.encode("World"));
          controller.close();
        },
      });

      // Send the mocked response immediately.
      return new HttpResponse(stream, {
        headers: {
          "Content-Type": "text/plain",
        },
      });
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

test("reproduce openHandles issue", async () => {
  await supertest("http://localhost").get("/video").expect(200);
});
