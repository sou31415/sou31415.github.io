import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import fs from "node:fs/promises";
import net from "node:net";
import { after, before, test } from "node:test";

let server;
let baseUrl;
let serverOutput = "";
const posts = JSON.parse(await fs.readFile(new URL("../content/blog/generated/posts.json", import.meta.url)));

before(async () => {
  const portReservation = net.createServer();
  portReservation.listen(0, "127.0.0.1");
  await once(portReservation, "listening");
  const { port } = portReservation.address();
  await new Promise((resolve) => portReservation.close(resolve));
  baseUrl = `http://127.0.0.1:${port}`;
  server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], {
    stdio: ["ignore", "pipe", "pipe"]
  });
  for (const stream of [server.stdout, server.stderr]) {
    stream.on("data", (chunk) => { serverOutput += chunk; });
  }
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(serverOutput);
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch { /* Wait for Next.js to listen. */ }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Production server did not start:\n${serverOutput}`);
});

after(async () => {
  if (server && server.exitCode === null) {
    const exited = once(server, "exit");
    server.kill("SIGTERM");
    await exited;
  }
});

async function getHtml(path) {
  const response = await fetch(`${baseUrl}${path}`);
  assert.equal(response.status, 200, path);
  return response.text();
}

function mainContent(html) {
  const match = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/);
  assert.ok(match, "Page has a main content landmark");
  return match[1];
}

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("'", "&#x27;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

test("home is a blog index with all real articles in generated order", async () => {
  const html = await getHtml("/");
  const main = mainContent(html);
  assert.match(main, /<h1>Blog<\/h1>/);
  assert.doesNotMatch(main, /スキルレベル|Apple Japan|改修工事中/);
  let previousIndex = -1;
  for (const post of posts) {
    const index = main.indexOf(`href="/blog/${post.slug}"`);
    assert.ok(index > previousIndex, `${post.title} is linked in chronological order`);
    assert.ok(main.includes(escapeHtml(post.title)));
    assert.ok(main.includes(`dateTime="${post.date}"`));
    previousIndex = index;
  }
  assert.match(main, /書き手について/);
  assert.match(html, /sou31415 \/ blog/);
  assert.doesNotMatch(html, /RuSwift Portfolio/);
});

test("legacy blog index shows exactly the same content as home", async () => {
  const [home, blog] = await Promise.all([getHtml("/"), getHtml("/blog")]);
  assert.equal(mainContent(blog), mainContent(home));
});

test("every existing article preserves its complete generated HTML and metadata", async () => {
  for (const post of posts) {
    const html = await getHtml(`/blog/${post.slug}`);
    const main = mainContent(html);
    assert.ok(main.includes(post.html), `${post.slug} preserves its complete sanitized article`);
    assert.ok(main.includes(`<h1>${escapeHtml(post.title)}</h1>`));
    assert.ok(html.includes(`<title>${escapeHtml(post.title)} | sou31415 / blog</title>`));
    assert.ok(main.includes(`dateTime="${post.date}"`));
    assert.ok(main.includes(post.date.replaceAll("-", ".")));
    const minutes = post.readingTime.match(/^(\d+) mins? read$/)?.[1];
    if (minutes) assert.ok(main.includes(`${minutes}分で読めます`));
    assert.doesNotMatch(main, /mins? read/);
  }
});

test("articles have return links before and after the text plus shared navigation", async () => {
  for (const post of posts) {
    const html = await getHtml(`/blog/${post.slug}`);
    const main = mainContent(html);
    assert.match(main, /href="\/">← 記事一覧<\/a>/);
    assert.match(main, /href="\/">← 記事一覧に戻る<\/a>/);
    assert.match(html, /href="#main-content"/);
    assert.match(html, /id="main-content"[^>]*tabindex="-1"/);
    assert.match(html, /aria-label="sou31415 ブログのトップへ"/);
  }
});

test("unknown article returns HTTP 404", async () => {
  const response = await fetch(`${baseUrl}/blog/this-article-does-not-exist`);
  assert.equal(response.status, 404);
});
