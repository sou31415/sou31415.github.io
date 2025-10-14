export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  tags: string[];
  body: string[];
};

export const posts: BlogPost[] = [
  {
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
  },
  {
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
  },
  {
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
  }
];

export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug);
}
