import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import fs from "node:fs/promises";
import net from "node:net";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";
import postcss from "postcss";

let server;
let baseUrl;
let serverOutput = "";
const posts = JSON.parse(await fs.readFile(new URL("../content/blog/generated/posts.json", import.meta.url)));
const clock = fileURLToPath(new URL("./helpers/blog-clock.cjs", import.meta.url));
const nineHours = 9 * 60 * 60 * 1000;
const publishedPosts = posts.filter((post) => Date.parse(post.date) - nineHours <= Date.now());

before(async () => {
  const portReservation = net.createServer();
  portReservation.listen(0, "127.0.0.1");
  await once(portReservation, "listening");
  const { port } = portReservation.address();
  await new Promise((resolve) => portReservation.close(resolve));
  baseUrl = `http://127.0.0.1:${port}`;
  server = spawn(process.execPath, ["--require", clock, "node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], {
    stdio: ["ignore", "pipe", "pipe", "ipc"]
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

function articlePathFor(slug) {
  return `/blog/${slug.split("/").map(encodeURIComponent).join("/")}`;
}

test("home is a blog index with all published articles in generated order", async () => {
  const html = await getHtml("/");
  const main = mainContent(html);
  assert.match(main, /<h1>ぶんしょう<\/h1>/);
  const heading = main.match(/<header class="index-heading">([\s\S]*?)<\/header>/)?.[1];
  assert.ok(heading);
  assert.doesNotMatch(heading, /<p[\s>]/);
  assert.doesNotMatch(main, /\d+分で読めます|mins? read/);
  assert.doesNotMatch(main, /スキルレベル|Apple Japan|改修工事中/);
  let previousIndex = -1;
  for (const post of publishedPosts) {
    const index = main.indexOf(`href="${escapeHtml(articlePathFor(post.slug))}"`);
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

test("every published article preserves its complete generated HTML and metadata", async () => {
  for (const post of publishedPosts) {
    const html = await getHtml(articlePathFor(post.slug));
    const main = mainContent(html);
    assert.ok(main.includes(post.html), `${post.slug} preserves its complete sanitized article`);
    assert.ok(main.includes(`<h1>${escapeHtml(post.title)}</h1>`));
    assert.ok(html.includes(`<title>${escapeHtml(post.title)} | sou31415 / blog</title>`));
    assert.ok(main.includes(`dateTime="${post.date}"`));
    assert.ok(main.includes(post.date.replaceAll("-", ".")));
    assert.doesNotMatch(main, /\d+分で読めます|mins? read/);
  }
});

test("articles have return links before and after the text plus shared navigation", async () => {
  for (const post of publishedPosts) {
    const html = await getHtml(articlePathFor(post.slug));
    const main = mainContent(html);
    assert.match(main, /href="\/">← 記事一覧<\/a>/);
    assert.match(main, /href="\/">← 記事一覧に戻る<\/a>/);
    assert.match(html, /href="#main-content"/);
    assert.match(html, /id="main-content"[^>]*tabindex="-1"/);
    assert.match(html, /aria-label="sou31415 ブログのトップへ"/);
  }
});

test("unknown article returns HTTP 404", async () => {
  for (const slug of ["this-article-does-not-exist", "notes/missing/article"]) {
    const response = await fetch(`${baseUrl}${articlePathFor(slug)}`);
    assert.equal(response.status, 404);
  }
});

async function setServerTime(blogTime) {
  const reply = once(server, "message", { signal: AbortSignal.timeout(5_000) });
  server.send({ blogTime });
  const [message] = await reply;
  assert.deepEqual(message, { blogTime });
}

test("a post becomes public at midnight JST without a rebuild or server restart", async () => {
  const [post] = posts;
  assert.ok(post, "At least one article is required to test publication");
  const articlePath = articlePathFor(post.slug);
  const articleTitle = `<title>${escapeHtml(post.title)} | sou31415 / blog</title>`;
  const paths = ["/", "/blog", articlePath];
  const midnightInJapan = Date.parse(post.date) - nineHours;

  async function requestPages() {
    return Promise.all(paths.map(async (path) => {
      const response = await fetch(`${baseUrl}${path}`);
      assert.match(response.headers.get("cache-control") ?? "", /\bno-store\b/, path);
      return { status: response.status, html: await response.text() };
    }));
  }

  try {
    await setServerTime(midnightInJapan - 1);
    const [homeBefore, blogBefore, articleBefore] = await requestPages();
    for (const page of [homeBefore, blogBefore]) {
      assert.equal(page.status, 200);
      assert.ok(!page.html.includes(`href="${escapeHtml(articlePath)}"`), "The article is absent from the list");
    }
    assert.equal(articleBefore.status, 404);
    assert.ok(!articleBefore.html.includes(articleTitle), "No article title in the hidden response");
    assert.ok(!articleBefore.html.includes('class="blog-markdown"'), "No article body in the hidden response");

    await setServerTime(midnightInJapan);
    const [homeAfter, blogAfter, articleAfter] = await requestPages();
    for (const page of [homeAfter, blogAfter]) {
      assert.equal(page.status, 200);
      assert.ok(page.html.includes(`href="${escapeHtml(articlePath)}"`));
    }
    assert.equal(articleAfter.status, 200);
    assert.ok(articleAfter.html.includes(articleTitle));
    assert.ok(articleAfter.html.includes(post.html));
  } finally {
    await setServerTime(null);
  }
});

function luminance(hex) {
  assert.match(hex, /^#(?:[\da-f]{3}|[\da-f]{6})$/i);
  const normalized = hex.length === 4 ? hex.slice(1).split("").map((digit) => digit.repeat(2)).join("") : hex.slice(1);
  const channels = normalized.match(/../g).map((channel) => {
    const value = parseInt(channel, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

test("served light and system-dark themes keep text readable on all reading surfaces", async () => {
  const html = await getHtml("/");
  const stylesheetPaths = [...html.matchAll(/<link\b[^>]*href="([^"]+\.css(?:\?[^"]*)?)"[^>]*>/g)].map((match) => match[1]);
  assert.ok(stylesheetPaths.length > 0, "Production page loads stylesheets");
  const styles = postcss.parse((await Promise.all(stylesheetPaths.map(getHtml))).join("\n"));
  const light = {};
  const dark = {};
  styles.walkRules(":root", (rule) => {
    let parent = rule.parent;
    let inDarkMode = false;
    while (parent) {
      if (parent.type === "atrule" && parent.name === "media" && /prefers-color-scheme\s*:\s*dark/.test(parent.params)) {
        inDarkMode = true;
      }
      parent = parent.parent;
    }
    rule.walkDecls((declaration) => {
      (inDarkMode ? dark : light)[declaration.prop] = declaration.value;
    });
  });
  assert.equal(light["color-scheme"], "light");
  assert.equal(dark["color-scheme"], "dark");
  assert.ok(luminance(dark["--paper"]) < luminance(light["--paper"]), "Dark background is darker");
  for (const [theme, palette] of [["light", light], ["dark", { ...light, ...dark }]]) {
    for (const background of ["--paper", "--wash", "--code-paper", "--selection"]) {
      const foregrounds = background === "--paper" ? ["--ink", "--muted", "--blue"] : ["--ink"];
      for (const foreground of foregrounds) {
        const values = [luminance(palette[foreground]), luminance(palette[background])];
        const ratio = (Math.max(...values) + 0.05) / (Math.min(...values) + 0.05);
        assert.ok(ratio >= 4.5, `${theme}: ${foreground} on ${background} has contrast ${ratio.toFixed(2)}`);
      }
    }
  }
});
