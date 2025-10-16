import type { Metadata } from "next";
import { BlogPostArticle } from "../_components/BlogPostArticle";
import { getPostBySlug } from "../posts";

const slug = "rust-backend-memo";
function resolvePost() {
  const postBySlug = getPostBySlug(slug);

  if (!postBySlug) {
    throw new Error(`Blog post with slug "${slug}" was not found.`);
  }

  return postBySlug;
}

const post = resolvePost();

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  openGraph: {
    title: post.title,
    description: post.description,
    type: "article",
    publishedTime: post.date
  }
};

export default function RustBackendMemoPage() {
  return <BlogPostArticle post={post} />;
}
