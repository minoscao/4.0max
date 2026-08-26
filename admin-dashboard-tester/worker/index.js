const FILE_ROUTE = "/api/files/";
const UPLOAD_ROUTE = "/api/uploads";
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function json(data, init = {}) {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("cache-control", "no-store");
  return new Response(JSON.stringify(data), { ...init, headers });
}

function extensionFor(contentType) {
  return {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  }[contentType];
}

function publicFileUrl(key) {
  return FILE_ROUTE + key.split("/").map(encodeURIComponent).join("/");
}

async function uploadFile(request, env) {
  if (!env.UPLOADS) return json({ error: "upload_storage_unavailable" }, { status: 503 });

  const contentType = request.headers.get("content-type")?.split(";", 1)[0]?.toLowerCase();
  if (!ALLOWED_IMAGE_TYPES.has(contentType)) {
    return json({ error: "unsupported_file_type" }, { status: 415 });
  }

  const contentLength = Number(request.headers.get("x-file-size") || request.headers.get("content-length"));
  if (!Number.isFinite(contentLength) || contentLength <= 0) {
    return json({ error: "missing_file_size" }, { status: 411 });
  }
  if (contentLength > MAX_UPLOAD_BYTES) {
    return json({ error: "file_too_large", maxBytes: MAX_UPLOAD_BYTES }, { status: 413 });
  }

  const now = new Date();
  const datePath = [now.getUTCFullYear(), String(now.getUTCMonth() + 1).padStart(2, "0")].join("/");
  const key = `maintenance/${datePath}/${crypto.randomUUID()}.${extensionFor(contentType)}`;
  const encodedName = request.headers.get("x-file-name") || "evidence";
  let originalName = "evidence";
  try {
    originalName = decodeURIComponent(encodedName).slice(0, 160);
  } catch {
    originalName = encodedName.slice(0, 160);
  }

  await env.UPLOADS.put(key, request.body, {
    httpMetadata: { contentType },
    customMetadata: { originalName, uploadedAt: now.toISOString() },
  });

  return json(
    { url: publicFileUrl(key), key, contentType, size: contentLength },
    { status: 201 },
  );
}

async function serveFile(request, env, pathname) {
  if (!env.UPLOADS) return json({ error: "upload_storage_unavailable" }, { status: 503 });

  let key;
  try {
    key = pathname.slice(FILE_ROUTE.length).split("/").map(decodeURIComponent).join("/");
  } catch {
    return json({ error: "invalid_file_key" }, { status: 400 });
  }
  if (!key.startsWith("maintenance/") || key.includes("..")) {
    return json({ error: "invalid_file_key" }, { status: 400 });
  }

  const object = await env.UPLOADS.get(key);
  if (!object) return json({ error: "file_not_found" }, { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata?.(headers);
  if (!headers.has("content-type")) headers.set("content-type", object.httpMetadata?.contentType || "application/octet-stream");
  headers.set("cache-control", "private, max-age=31536000, immutable");
  if (object.httpEtag) headers.set("etag", object.httpEtag);
  return new Response(request.method === "HEAD" ? null : object.body, { headers });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === UPLOAD_ROUTE) {
      if (request.method !== "POST") return json({ error: "method_not_allowed" }, { status: 405, headers: { allow: "POST" } });
      return uploadFile(request, env);
    }

    if (url.pathname.startsWith(FILE_ROUTE)) {
      if (!["GET", "HEAD"].includes(request.method)) return json({ error: "method_not_allowed" }, { status: 405, headers: { allow: "GET, HEAD" } });
      return serveFile(request, env, url.pathname);
    }

    const response = await env.ASSETS.fetch(request);
    const acceptsHtml = request.headers.get("accept")?.includes("text/html");

    if (response.status !== 404 || !acceptsHtml || !["GET", "HEAD"].includes(request.method)) {
      return response;
    }

    const indexUrl = new URL(request.url);
    indexUrl.pathname = "/index.html";
    indexUrl.search = "";
    return env.ASSETS.fetch(new Request(indexUrl, request));
  },
};
