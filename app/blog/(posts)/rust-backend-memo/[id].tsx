import type { Metadata } from "next";
import { BlogPostArticle } from "../../_components/BlogPostArticle";
import type { BlogPost } from "../../posts";

export const post: BlogPost = {
  slug: "rust-backend-memo",
  title: "Rustバックエンド開発のメモ",
  description:
    "Actix-Webでの開発フローを整理しながら、Rustらしいエラーハンドリングや型設計について振り返りました。",
  date: "2024-05-02",
  readingTime: "6 min read",
  tags: ["Rust", "Backend", "Actix"],
  body: [
    "RustでAPIサーバーを実装すると、型安全なハンドラーと落ち着いたパフォーマンスが得られます。特にActix-Webのextractorは便利で、リクエスト検証のコード量をかなり削減できます。",
    "一方で、エラーハンドリングの分岐が増えると読みづらさが出てきます。Result型をうまく活用し、contextを加えながらanyhowでまとめる手法が現場でも好評でした。",
    "今回のプロジェクトでは、OpenAPIドキュメントの自動生成も導入しました。テストとドキュメントの同期が取りやすくなり、フロントとの調整がスムーズになった点が大きな収穫です。"
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

export default function RustBackendMemoPage() {
  return <BlogPostArticle post={post} />;
}
