import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

const contentDir = path.join(process.cwd(), "content", "blog", "posts");
const outputDir = path.join(process.cwd(), "content", "blog", "generated");
const overridesPath = path.join(process.cwd(), "content", "blog", "overrides.json");
const indexPath = path.join(outputDir, "index.json");
const postsPath = path.join(outputDir, "posts.json");

const frontMatterOptions = {
  engines: {
    yaml: (frontMatter) => matter.engines.yaml.parse(
      // Accept the compact `status:pending` form in the metadata block.
      frontMatter.replace(/^status:(?=\S)/gm, "status: ")
    )
  }
};

function extractTitleAndBody(markdown) {
  const lines = markdown.split(/\r?\n/);
  let title = null;
  let titleIndex = -1;

  for (let i = 0; i < lines.length; i += 1) {
    const match = lines[i].match(/^#\s+(.+)$/);
    if (match) {
      title = match[1].trim();
      titleIndex = i;
      break;
    }
  }

  if (titleIndex === -1) {
    return { title: null, body: markdown };
  }

  const before = lines.slice(0, titleIndex);
  const after = lines.slice(titleIndex + 1);
  if (after.length > 0 && after[0].trim() === "") {
    after.shift();
  }

  return {
    title,
    body: [...before, ...after].join("\n")
  };
}

function estimateReadingTime(text) {
  const trimmed = text.trim();
  if (!trimmed) {
    return "1 mins read";
  }

  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordMinutes = Math.ceil(words.length / 200);
  const cjkMatches = trimmed.match(
    /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu
  );
  const cjkCount = cjkMatches ? cjkMatches.length : 0;
  const cjkMinutes = cjkCount ? Math.ceil(cjkCount / 500) : 0;
  const minutes = Math.max(1, wordMinutes, cjkMinutes);

  return `${minutes} mins read`;
}

function ensureValidDate(date, slug) {
  if (typeof date !== "string" || date.trim() === "") {
    throw new Error(`date is required in front matter or overrides: ${slug}.md`);
  }

  const trimmed = date.trim();
  const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    throw new Error(`date must be YYYY-MM-DD: ${slug}.md (${date})`);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const normalized = new Date(Date.UTC(year, month - 1, day));

  if (
    Number.isNaN(normalized.getTime()) ||
    normalized.getUTCFullYear() !== year ||
    normalized.getUTCMonth() + 1 !== month ||
    normalized.getUTCDate() !== day
  ) {
    throw new Error(`date is invalid: ${slug}.md (${date})`);
  }

  return trimmed;
}

function normalizeTags(tags) {
  if (!Array.isArray(tags)) {
    return [];
  }
  return tags.map((tag) => String(tag));
}

async function renderMarkdown(markdown) {
  const processed = await remark()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(markdown);

  return processed.toString();
}

async function getMarkdownFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getMarkdownFiles(filePath));
    } else if (entry.isFile() && path.extname(entry.name) === ".md") {
      files.push(filePath);
    }
  }
  return files;
}

async function readOverrides() {
  try {
    const raw = await fs.readFile(overridesPath, "utf8");
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") {
      throw new Error("overrides.json must be an object keyed by slug.");
    }
    return data;
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw error;
  }
}

function applyOverrides(post, overrides) {
  const entry = overrides[post.slug];
  if (!entry || typeof entry !== "object") {
    return post;
  }

  return {
    ...post,
    readingTime:
      typeof entry.readingTime === "string" ? entry.readingTime : post.readingTime,
    description:
      typeof entry.description === "string" ? entry.description : post.description,
    date: typeof entry.date === "string" ? entry.date : post.date,
    tags: Array.isArray(entry.tags) ? normalizeTags(entry.tags) : post.tags
  };
}

async function generate() {
  await fs.mkdir(contentDir, { recursive: true });
  const files = await getMarkdownFiles(contentDir);
  const overrides = await readOverrides();
  const posts = [];

  for (const filePath of files) {
    const relativeFilePath = path.relative(contentDir, filePath).split(path.sep).join("/");
    const slug = relativeFilePath.slice(0, -".md".length);
    const raw = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(raw, frontMatterOptions);
    const status = data.status === undefined ? "ready" : data.status;
    if (status === "pending") continue;
    if (status !== "ready") {
      throw new Error(`status must be pending or ready: ${relativeFilePath}`);
    }
    const { title, body } = extractTitleAndBody(content);
    const html = await renderMarkdown(body);

    const post = {
      slug,
      title: title ?? path.basename(filePath, ".md"),
      description: typeof data.description === "string" ? data.description : "",
      date: typeof data.date === "string" ? data.date : "",
      readingTime: estimateReadingTime(body),
      tags: normalizeTags(data.tags),
      html
    };

    const withOverrides = applyOverrides(post, overrides);
    posts.push({
      ...withOverrides,
      date: ensureValidDate(withOverrides.date, slug)
    });
  }

  posts.sort((first, second) => {
    const firstDate = first.date ? new Date(first.date).getTime() : 0;
    const secondDate = second.date ? new Date(second.date).getTime() : 0;
    if (secondDate !== firstDate) {
      return secondDate - firstDate;
    }
    return first.slug.localeCompare(second.slug);
  });

  const index = posts.map(({ html, ...summary }) => summary);

  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(indexPath, JSON.stringify(index, null, 2));
  await fs.writeFile(postsPath, JSON.stringify(posts, null, 2));
}

generate().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
