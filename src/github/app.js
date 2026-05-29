import crypto from "node:crypto";

const DEFAULT_APP_SLUG = "ai-sprawl";

export function buildInstallUrl() {
  const slug = process.env.GITHUB_APP_SLUG || DEFAULT_APP_SLUG;
  return `https://github.com/apps/${slug}/installations/new`;
}

export function summarizeGithubAppConfig() {
  return {
    appSlug: process.env.GITHUB_APP_SLUG || DEFAULT_APP_SLUG,
    webhookSecretConfigured: Boolean(process.env.GITHUB_APP_WEBHOOK_SECRET),
    webhookPath: "/webhooks/github",
    installUrl: buildInstallUrl(),
    notes: [
      "This scaffold does not yet exchange GitHub App JWTs for installation tokens.",
      "It is ready for install-linking and webhook ingestion.",
    ],
  };
}

export function verifyGithubWebhook(rawBody, signatureHeader) {
  const secret = process.env.GITHUB_APP_WEBHOOK_SECRET;
  if (!secret) {
    return true;
  }

  if (!signatureHeader || typeof signatureHeader !== "string") {
    return false;
  }

  const expected = `sha256=${crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex")}`;

  return timingSafeEqual(expected, signatureHeader);
}

function timingSafeEqual(expected, actual) {
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(actual);

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}
