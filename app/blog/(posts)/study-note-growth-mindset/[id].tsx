import type { Metadata } from "next";
import { BlogPostArticle } from "../../_components/BlogPostArticle";
import type { BlogPost } from "../../posts";

export const post: BlogPost = {
  slug: "study-note-growth-mindset",
  title: "学び続けるためのマインドセット",
  description:
    "技術的な挑戦を継続するために意識している、日々の習慣や学習サイクルの作り方を紹介します。",
  date: "2024-03-18",
  readingTime: "3 min read",
  tags: ["Learning", "Mindset"],
  body: [
    "技術領域は日々アップデートされるため、キャッチアップのリズムを作ることが欠かせません。私は毎朝30分のインプットタイムを確保し、論文やRFCを読むようにしています。",
    "インプットだけで終わらせず、必ず小さなアウトプットにつなげるのがコツです。週末には学んだ内容をまとめ、翌週のタスクに反映させています。",
    "また、学習ログをNotionで管理し、振り返りのサイクルを回すことで、モチベーションを維持しています。継続の鍵は、自分に合ったリズムを早く見つけることに尽きます。"
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
