import type { BlogPost, BlogPostSummary } from "./types";
import indexData from "../../content/blog/generated/index.json";
import postsData from "../../content/blog/generated/posts.json";

const posts = postsData as BlogPost[];
const summaries = indexData as BlogPostSummary[];

const postsBySlug = new Map(posts.map((post) => [post.slug, post] as const));

export function getAllPosts(): BlogPostSummary[] {
  return summaries.slice();
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return postsBySlug.get(slug);
}

export function getAllSlugs(): string[] {
  return summaries.map((post) => post.slug);
}

export type { BlogPost, BlogPostSummary } from "./types";
