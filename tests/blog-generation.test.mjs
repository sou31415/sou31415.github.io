import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const generator = fileURLToPath(new URL("../scripts/generate-blog.mjs", import.meta.url));

async function createFixture(t) {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), "blog-generation-"));
  t.after(() => fs.rm(cwd, { recursive: true, force: true }));
  const posts = path.join(cwd, "content/blog/posts");
  await fs.mkdir(posts, { recursive: true });

  return {
    writePost: async (slug, frontMatter) => {
      const filePath = path.join(posts, `${slug}.md`);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(
        filePath,
        `---\n${frontMatter}\n---\n\n# ${slug}\n\nstatus:pending in the article body.\n`
      );
    },
    generate: () => promisify(execFile)(process.execPath, [generator], { cwd }),
    readCatalog: async (name) => JSON.parse(await fs.readFile(path.join(cwd, `content/blog/generated/${name}.json`), "utf8"))
  };
}

test("pending posts stay out of the generated blog catalog regardless of date", async (t) => {
  const { writePost, generate, readCatalog } = await createFixture(t);
  await Promise.all([
    writePost("past-pending", 'date: "2020-01-01"\nstatus: pending'),
    writePost("future-pending", 'date: "2099-01-02"\nstatus:pending'),
    writePost("scheduled", 'date: "2099-01-01"\nstatus: ready'),
    writePost("legacy", 'date: "2020-01-01"')
  ]);
  await generate();
  const [index, posts] = await Promise.all([readCatalog("index"), readCatalog("posts")]);
  assert.deepEqual(index.map(({ slug }) => slug), ["scheduled", "legacy"]);
  assert.deepEqual(posts.map(({ slug }) => slug), ["scheduled", "legacy"]);
  assert.match(posts[0].html, /status:pending in the article body\./);

  await writePost("past-pending", 'date: "2020-01-01"\nstatus:ready');
  await generate();
  assert.ok((await readCatalog("posts")).some(({ slug }) => slug === "past-pending"));
});

test("a typo in the publication status fails generation instead of exposing the draft", async (t) => {
  const { writePost, generate } = await createFixture(t);
  await writePost("typo", 'date: "2020-01-01"\nstatus: pendng');
  await assert.rejects(generate, { stderr: /status must be pending or ready: typo\.md/ });
});

test("nested post paths become URL slugs while the catalog keeps every article", async (t) => {
  const { writePost, generate, readCatalog } = await createFixture(t);
  await Promise.all([
    writePost("advent2026/day-01", 'date: "2026-12-01"\nstatus: ready'),
    writePost("advent2026/day-02", 'date: "2026-12-02"\nstatus: ready'),
    writePost("notes/advent2026/day-01", 'date: "2026-12-03"\nstatus: ready'),
    writePost("シリーズ 2026/day 04", 'date: "2026-12-05"\nstatus: ready'),
    writePost("advent2026/day-03", 'date: "2026-12-04"\nstatus: pending')
  ]);

  await generate();
  const index = await readCatalog("index");
  assert.deepEqual(index.map(({ slug }) => slug), [
    "シリーズ 2026/day 04",
    "notes/advent2026/day-01",
    "advent2026/day-02",
    "advent2026/day-01"
  ]);
  assert.ok(!index.some(({ slug }) => slug.endsWith("day-03")));

  const posts = await readCatalog("posts");
  assert.deepEqual(posts.map(({ slug }) => slug), index.map(({ slug }) => slug));
  assert.equal(posts.find(({ slug }) => slug === "advent2026/day-01").title, "advent2026/day-01");
  assert.equal(posts.find(({ slug }) => slug === "notes/advent2026/day-01").title, "notes/advent2026/day-01");
});
