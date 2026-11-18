import { createServer as createHttpServer } from "node:http";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const BODY_LIMIT = 8192;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 3;

function json(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

function normalizePhone(value) {
  return typeof value === "string" ? value.replace(/\D/g, "") : "";
}

async function readJson(request) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (Buffer.byteLength(body) > BODY_LIMIT) {
      const error = new Error("Request body too large");
      error.statusCode = 413;
      throw error;
    }
  }
  return JSON.parse(body);
}

export function createServer(options = {}) {
  const sendUrl = options.sendUrl ?? process.env.PHILSMS_SEND_URL;
  const apiToken = options.apiToken ?? process.env.PHILSMS_API_TOKEN;
  const senderId = options.senderId ?? process.env.PHILSMS_SENDER_ID;
  const allowedRecipients = new Set(
    (options.allowedRecipients ?? process.env.SOS_ALLOWED_RECIPIENTS ?? "")
      .split(",")
      .map((number) => normalizePhone(number.trim()))
      .filter(Boolean),
  );
  const fetchImpl = options.fetchImpl ?? fetch;
  const recentRequests = new Map();

  return createHttpServer(async (request, response) => {
    const requestUrl = new URL(request.url, "http://localhost");

    if (request.method === "GET" && requestUrl.pathname === "/health") {
      json(response, 200, { ok: true });
      return;
    }

    if (request.method !== "POST" || requestUrl.pathname !== "/sos") {
      json(response, 404, { error: "Not found" });
      return;
    }

    let payload;
    try {
      payload = await readJson(request);
    } catch (error) {
      json(response, error.statusCode ?? 400, { error: "Invalid request body" });
      return;
    }

    const recipient = normalizePhone(payload?.to);
    const message = typeof payload?.message === "string" ? payload.message.trim() : "";
    if (recipient.length < 7 || recipient.length > 15 || !message || message.length > 500) {
      json(response, 400, { error: "A valid recipient and message are required" });
      return;
    }

    if (!allowedRecipients.has(recipient)) {
      json(response, 403, { error: "This recipient is not enabled for SOS" });
      return;
    }

    if (!sendUrl || !apiToken || !senderId) {
      json(response, 503, { error: "The SMS service is not configured" });
      return;
    }

    const now = Date.now();
    const clientKey = `${request.socket.remoteAddress}:${recipient}`;
    const recent = (recentRequests.get(clientKey) ?? []).filter(
      (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
    );
    if (recent.length >= RATE_LIMIT_MAX) {
      json(response, 429, { error: "Too many SOS requests. Please wait before trying again." });
      return;
    }
    recent.push(now);
    recentRequests.set(clientKey, recent);

    try {
      const providerResponse = await fetchImpl(sendUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient,
          sender_id: senderId,
          type: "plain",
          message,
        }),
      });

      if (!providerResponse.ok) {
        json(response, 502, { error: "The SMS provider rejected the SOS request" });
        return;
      }

      json(response, 202, { accepted: true });
    } catch {
      json(response, 502, { error: "Could not reach the SMS provider" });
    }
  });
}

const launchedFile = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : "";
if (import.meta.url === launchedFile) {
  const port = Number(process.env.PORT || 8787);
  createServer().listen(port, "0.0.0.0", () => {
    console.log(`SOS API listening on port ${port}`);
  });
}