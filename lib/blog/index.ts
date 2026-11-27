import type { BlogPost, BlogPostSummary } from "./types";
import indexData from "../../content/blog/generated/index.json";
import postsData from "../../content/blog/generated/posts.json";

const posts = postsData as BlogPost[];
const summaries = indexData as BlogPostSummary[];

const postsBySlug = new Map(posts.map((post) => [post.slug, post] as const));

function isPublished({ date }: BlogPostSummary, now: number): boolean {
  return Date.parse(`${date}T00:00:00+09:00`) <= now;
}

export function getAllPosts(): BlogPostSummary[] {
  const now = Date.now();
  return summaries.filter((post) => isPublished(post, now));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const post = postsBySlug.get(slug);
  return post && isPublished(post, Date.now()) ? post : undefined;
}

export type { BlogPost, BlogPostSummary } from "./types";
