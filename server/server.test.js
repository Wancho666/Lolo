import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createServer } from "./server.js";

let server;
let serverUrl;
let providerRequests;

before(async () => {
  providerRequests = [];
  server = createServer({
    sendUrl: "https://provider.example.test/sms/send",
    apiToken: "test-token",
    senderId: "TEST",
    allowedRecipients: "639171234567",
    fetchImpl: async (url, options) => {
      providerRequests.push({ url, options });
      return new Response("{}", { status: 200 });
    },
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  serverUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test("health endpoint responds without exposing configuration", async () => {
  const response = await fetch(`${serverUrl}/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
});

test("SOS request forwards the approved recipient and message to the provider", async () => {
  const response = await fetch(`${serverUrl}/sos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: "+63 917 123 4567",
      contactName: "Emergency Contact",
      message: "SOS: I need help.",
    }),
  });

  assert.equal(response.status, 202);
  assert.deepEqual(await response.json(), { accepted: true });
  assert.equal(providerRequests.length, 1);
  assert.equal(providerRequests[0].options.headers.Authorization, "Bearer test-token");
  assert.deepEqual(JSON.parse(providerRequests[0].options.body), {
    recipient: "639171234567",
    sender_id: "TEST",
    type: "plain",
    message: "SOS: I need help.",
  });
});

test("SOS request cannot send to a recipient outside the allowlist", async () => {
  const response = await fetch(`${serverUrl}/sos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to: "+63 918 000 0000", message: "SOS" }),
  });

  assert.equal(response.status, 403);
  assert.equal(providerRequests.length, 1);
});