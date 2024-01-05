const supertest = require("supertest");
const { http, HttpResponse } = require("msw");
const { setupServer } = require("msw/node");

const encoder = new TextEncoder();

test("reproduce openHandles issue", async () => {
  // Provide the server-side API with the request handlers.
  const server = setupServer(
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

  // Start the interception.
  server.listen();

  await supertest("http://localhost").get("/video").expect(200);
});
