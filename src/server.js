import { createServer } from "node:http";
import { URL } from "node:url";

import { scorePullRequest } from "./risk/score.js";
import { buildInstallUrl, summarizeGithubAppConfig, verifyGithubWebhook } from "./github/app.js";
import { readJsonBody, sendJson, sendText } from "./util/http.js";

const port = Number(process.env.PORT || 3000);

const server = createServer(async (req, res) => {
  const requestUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const { pathname } = requestUrl;

  if (req.method === "GET" && pathname === "/") {
    return sendText(
      res,
      [
        "ai-sprawl",
        "",
        "AI Code Governance starter service.",
        "",
        "Routes:",
        "GET /health",
        "GET /github/install",
        "GET /github/config",
        "POST /api/risk/score",
        "POST /webhooks/github",
      ].join("\n")
    );
  }

  if (req.method === "GET" && pathname === "/health") {
    return sendJson(res, {
      ok: true,
      service: "ai-sprawl",
      timestamp: new Date().toISOString(),
    });
  }

  if (req.method === "GET" && pathname === "/github/install") {
    return sendJson(res, {
      installUrl: buildInstallUrl(),
      config: summarizeGithubAppConfig(),
    });
  }

  if (req.method === "GET" && pathname === "/github/config") {
    return sendJson(res, summarizeGithubAppConfig());
  }

  if (req.method === "POST" && pathname === "/api/risk/score") {
    const body = await readJsonBody(req);
    return sendJson(res, scorePullRequest(body));
  }

  if (req.method === "POST" && pathname === "/webhooks/github") {
    const body = await readJsonBody(req, { raw: true });
    const signature = req.headers["x-hub-signature-256"];
    const event = req.headers["x-github-event"] || "unknown";

    if (!verifyGithubWebhook(body.raw, signature)) {
      return sendJson(res, { ok: false, error: "invalid webhook signature" }, 401);
    }

    return sendJson(res, {
      ok: true,
      event,
      receivedAt: new Date().toISOString(),
    });
  }

  return sendJson(res, { ok: false, error: "not found" }, 404);
});

server.listen(port, () => {
  console.log(`ai-sprawl listening on http://localhost:${port}`);
  console.log(`install URL: ${buildInstallUrl()}`);
});
