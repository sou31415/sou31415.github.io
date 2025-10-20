import type { Metadata } from "next";
import { BlogPostArticle } from "../../_components/BlogPostArticle";
import type { BlogPost } from "../../posts";

export const post: BlogPost = {
  slug: "test",
  title: "テストArtifact",
  description:
    "テスト記事です",
  date: "2025-10-21",
  readingTime: "3 min read",
  tags: [],
  body: [
    "これはテスト用の文章です",
    "改行が正しくされていることを確認します"
  ]
};

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

export default function StudyNoteGrowthMindsetPage() {
  return <BlogPostArticle post={post} />;
}
