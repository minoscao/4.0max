import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";
import worker from "../worker/index.js";

function mockBucket() {
  const objects = new Map();
  return {
    objects,
    async put(key, body, options) {
      const bytes = new Uint8Array(await new Response(body).arrayBuffer());
      objects.set(key, { bytes, options });
    },
    async get(key) {
      const stored = objects.get(key);
      if (!stored) return null;
      return {
        body: stored.bytes,
        httpEtag: '"test-etag"',
        httpMetadata: stored.options.httpMetadata,
        writeHttpMetadata(headers) {
          headers.set("content-type", stored.options.httpMetadata.contentType);
        },
      };
    },
  };
}

test("serves existing static assets without a fallback", async () => {
  const calls = [];
  const response = await worker.fetch(new Request("https://example.test/assets/app.js"), {
    ASSETS: {
      fetch: async (request) => {
        calls.push(new URL(request.url).pathname);
        return new Response("asset", { status: 200 });
      },
    },
  });

  assert.equal(response.status, 200);
  assert.deepEqual(calls, ["/assets/app.js"]);
});

test("falls back to index.html for an unknown app route", async () => {
  const calls = [];
  const response = await worker.fetch(
    new Request("https://example.test/flow/step-two?source=share", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async (request) => {
          const url = new URL(request.url);
          calls.push(url.pathname + url.search);
          return new Response(url.pathname === "/index.html" ? "app" : "missing", {
            status: url.pathname === "/index.html" ? 200 : 404,
          });
        },
      },
    },
  );

  assert.equal(response.status, 200);
  assert.deepEqual(calls, ["/flow/step-two?source=share", "/index.html"]);
});

test("does not turn missing API or write requests into the app shell", async () => {
  for (const request of [
    new Request("https://example.test/api/missing", { headers: { accept: "application/json" } }),
    new Request("https://example.test/flow", { method: "POST", headers: { accept: "text/html" } }),
  ]) {
    let calls = 0;
    const response = await worker.fetch(request, {
      ASSETS: {
        fetch: async () => {
          calls += 1;
          return new Response("missing", { status: 404 });
        },
      },
    });

    assert.equal(response.status, 404);
    assert.equal(calls, 1);
  }
});

test("stores uploaded image bytes in R2 and returns only a file URL", async () => {
  const bucket = mockBucket();
  const bytes = new Uint8Array([255, 216, 255, 217]);
  const response = await worker.fetch(
    new Request("https://example.test/api/uploads", {
      method: "POST",
      headers: {
        "content-type": "image/jpeg",
        "x-file-name": encodeURIComponent("现场照片.jpg"),
        "x-file-size": String(bytes.byteLength),
      },
      body: bytes,
    }),
    { UPLOADS: bucket },
  );

  assert.equal(response.status, 201);
  const payload = await response.json();
  assert.match(payload.url, /^\/api\/files\/maintenance\/\d{4}\/\d{2}\/[\w-]+\.jpg$/);
  assert.equal("data" in payload, false);
  assert.equal(bucket.objects.size, 1);
  const stored = [...bucket.objects.values()][0];
  assert.deepEqual(stored.bytes, bytes);
  assert.equal(stored.options.customMetadata.originalName, "现场照片.jpg");
});

test("serves a stored image through its private same-origin URL", async () => {
  const bucket = mockBucket();
  const key = "maintenance/2026/08/example.jpg";
  const bytes = new Uint8Array([1, 2, 3, 4]);
  await bucket.put(key, bytes, { httpMetadata: { contentType: "image/jpeg" }, customMetadata: {} });

  const response = await worker.fetch(
    new Request(`https://example.test/api/files/${key}`),
    { UPLOADS: bucket },
  );

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "image/jpeg");
  assert.match(response.headers.get("cache-control"), /immutable/);
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), bytes);
});

test("rejects unsafe uploads before writing to storage", async () => {
  const bucket = mockBucket();
  const response = await worker.fetch(
    new Request("https://example.test/api/uploads", {
      method: "POST",
      headers: { "content-type": "application/pdf", "x-file-size": "4" },
      body: "test",
    }),
    { UPLOADS: bucket },
  );

  assert.equal(response.status, 415);
  assert.equal(bucket.objects.size, 0);
});

test("reports a clear error when object storage is not bound", async () => {
  const response = await worker.fetch(
    new Request("https://example.test/api/uploads", {
      method: "POST",
      headers: { "content-type": "image/jpeg", "x-file-size": "4" },
      body: "test",
    }),
    {},
  );

  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { error: "upload_storage_unavailable" });
});

test("emits the files required by Sites packaging", async () => {
  await access(new URL("../dist/client/index.html", import.meta.url));
  await access(new URL("../dist/server/index.js", import.meta.url));
  await access(new URL("../dist/.openai/hosting.json", import.meta.url));
});
