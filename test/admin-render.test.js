const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const vm = require("node:vm");

const adminScript = readFileSync("public/admin.js", "utf8");
const context = {
  document: {
    addEventListener() {}
  }
};

vm.runInNewContext(adminScript, context);

test("admin HTML output escapes customer-controlled values", () => {
  assert.equal(
    context.escapeHtml(`<img src=x onerror="alert('x')">&`),
    "&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt;&amp;"
  );
});
