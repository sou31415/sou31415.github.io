import type { Metadata } from "next";
import type { BlogPost } from "./types";
import { buildBlogPostMetadata, getMissingPostMetadata } from "./metadata";
import { getPostBySlug } from "./posts";

export type BlogPostResolution = {
  post: BlogPost | null;
  metadata: Metadata;
};

export function resolveBlogPost(slug: string): BlogPostResolution {
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      post: null,
      metadata: getMissingPostMetadata()
    };
  }

  return {
    post,
    metadata: buildBlogPostMetadata(post)
  };
}
