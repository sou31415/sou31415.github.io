import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

const contentDir = path.join(process.cwd(), "content", "blog");
const outputDir = path.join(contentDir, "generated");
const indexPath = path.join(outputDir, "index.json");
const postsPath = path.join(outputDir, "posts.json");

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
  const words = text.trim().split(/\s+/).filter(Boolean);
  const minutes = Math.max(1, Math.ceil(words.length / 200));
  return `${minutes} mins read`;
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

async function getMarkdownFiles() {
  try {
    const entries = await fs.readdir(contentDir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && path.extname(entry.name) === ".md")
      .map((entry) => entry.name);
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.mkdir(contentDir, { recursive: true });
      return [];
    }
    throw error;
  }
}

async function generate() {
  const files = await getMarkdownFiles();
  const posts = [];

  for (const fileName of files) {
    const slug = path.basename(fileName, ".md");
    const filePath = path.join(contentDir, fileName);
    const raw = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(raw);
    const { title, body } = extractTitleAndBody(content);
    const html = await renderMarkdown(body);

    posts.push({
      slug,
      title: title ?? slug,
      description: typeof data.description === "string" ? data.description : "",
      date: typeof data.date === "string" ? data.date : "",
      readingTime: estimateReadingTime(body),
      tags: normalizeTags(data.tags),
      html
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
