import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("keeps the Arabic results lookup page content", async () => {
  const [page, layout] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
  ]);

  assert.match(layout, /lang="ar"/);
  assert.match(layout, /dir="rtl"/);
  assert.match(layout, /نتيجة الثانوية العامة/);
  assert.match(page, /رقم الجلوس/);
  assert.match(page, /Developed by Eng\. Abuzaid Saad/);
  assert.match(page, /student-name/);
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
