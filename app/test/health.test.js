const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");

const app = require("../src/app");

test("GET /health returns 200 OK", async () => {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));

  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/health`);

  assert.equal(response.status, 200);
  assert.equal(await response.text(), "OK");

  await new Promise((resolve) => server.close(resolve));
});

