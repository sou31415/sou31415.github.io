import type { Metadata } from "next";
import { BlogPostArticle } from "../../_components/BlogPostArticle";
import type { BlogPost } from "../../posts";

export const post: BlogPost = {
  slug: "portfolio-refresh-2024",
  title: "2024年ポートフォリオ刷新の舞台裏",
  description:
    "デザインコンセプトを磨き込みながら、App Routerへの移行とアクセシビリティ改善に取り組んだ記録です。",
  date: "2024-06-20",
  readingTime: "4 min read",
  tags: ["Design", "Next.js", "Accessibility"],
  body: [
    "今年のポートフォリオでは、静的なページ群からApp Routerを使った構造へ移行しました。ヘッダーやコンポーネントを分解し、ルーティングを明確化することで、コンテンツ追加のスピードが劇的に向上しました。",
    "特に意識したのは視認性とキーボード操作のしやすさです。ナビゲーションのラベルを改善し、ARIA属性を活用したことで、読み上げソフトでも迷わず移動できるようになりました。",
    "この刷新を通じて、デザイナーとエンジニアの観点を往復するプロセスの大切さを再確認しました。細部までこだわることで、体験のクオリティは確実に向上します。"
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

export default function PortfolioRefresh2024Page() {
  return <BlogPostArticle post={post} />;
}
