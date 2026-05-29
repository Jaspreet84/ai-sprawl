export async function readJsonBody(req, { raw = false } = {}) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const buffer = Buffer.concat(chunks);
  if (raw) {
    return { raw: buffer, text: buffer.toString("utf8") };
  }

  if (buffer.length === 0) {
    return {};
  }

  try {
    return JSON.parse(buffer.toString("utf8"));
  } catch {
    return { error: "invalid json" };
  }
}

export function sendJson(res, body, statusCode = 200) {
  res.writeHead(statusCode, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body, null, 2));
}

export function sendText(res, body, statusCode = 200) {
  res.writeHead(statusCode, { "content-type": "text/plain; charset=utf-8" });
  res.end(body);
}
