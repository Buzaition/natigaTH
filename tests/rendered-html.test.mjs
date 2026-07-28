import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renders the Arabic results lookup page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]+lang="ar"[^>]+dir="rtl"/);
  assert.match(html, /نتيجة الثانوية العامة/);
  assert.match(html, /رقم الجلوس/);
  assert.match(html, /Developed by Eng\. Abuzaid Saad/);
  assert.doesNotMatch(html, /codex-preview|Building your site|react-loading-skeleton/);
});

test("keeps lookup behavior numeric and data-backed", async () => {
  const page = await readFile(new URL("app/page.tsx", root), "utf8");
  const shard = JSON.parse(await readFile(new URL("public/data/200.json", root), "utf8"));

  assert.match(page, /replace\(\/\\D\/g, ""\)/);
  assert.match(page, /fetch\(`\/data\/\$\{cleaned\.slice\(0, 3\)\}\.json`\)/);
  assert.match(page, /Math\.trunc\(value \* 10000\)/);
  assert.doesNotMatch(page, /percentage\.toFixed/);
  assert.deepEqual(shard["2001970"], [
    "احمد محمود السيد عبدالجواد السيد",
    290,
    "ناجح دور أول",
  ]);
});
