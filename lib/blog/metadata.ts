import type { Metadata } from "next";
import type { BlogPost } from "./types";

const missingPostMetadata: Metadata = {
  title: "記事が見つかりません",
  description: "指定されたブログ記事は存在しません。"
};

export function buildBlogPostMetadata(post: BlogPost): Metadata {
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date
    }
  };
}

export function getMissingPostMetadata(): Metadata {
  return { ...missingPostMetadata };
}
