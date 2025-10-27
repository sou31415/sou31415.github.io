import { birthday21Post } from "./data/birthday21";
import { testPost } from "./data/test";
import type { BlogPost } from "./types";

const allPosts: BlogPost[] = [birthday21Post, testPost];

const postsBySlug = new Map(allPosts.map((post) => [post.slug, post] as const));
const postsSortedByDate = [...allPosts].sort((first, second) =>
  new Date(second.date).getTime() - new Date(first.date).getTime()
);

export function getAllPosts(): BlogPost[] {
  return postsSortedByDate.slice();
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return postsBySlug.get(slug);
}

export type { BlogPost } from "./types";
