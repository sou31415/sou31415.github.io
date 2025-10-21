import type { Metadata } from "next";
import { BlogPostArticle } from "../../_components/BlogPostArticle";
import { post } from "./post";

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

export default function TestPostPage() {
  return <BlogPostArticle post={post} />;
}
