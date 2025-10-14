import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "./posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "最新の活動や学びをまとめたブログ記事の一覧です。"
};

export default function BlogIndexPage() {
  return (
    <main className="blog-container">
      <header className="blog-header">
        <h1>Blog</h1>
        <p>最近取り組んだプロジェクトや学びのメモをまとめています。</p>
      </header>
      <ul className="blog-list">
        {posts.map((post) => (
          <li key={post.slug} className="blog-card">
            <article>
              <header>
                <p className="blog-card__meta">
                  <time dateTime={post.date}>{post.date}</time>
                  <span aria-hidden="true">・</span>
                  <span>{post.readingTime}</span>
                </p>
                <h2 className="blog-card__title">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
              </header>
              <p className="blog-card__description">{post.description}</p>
              <ul className="blog-card__tags" aria-label="タグ">
                {post.tags.map((tag) => (
                  <li key={tag}>#{tag}</li>
                ))}
              </ul>
              <footer>
                <Link className="blog-card__link" href={`/blog/${post.slug}`}>
                  記事を読む
                </Link>
              </footer>
            </article>
          </li>
        ))}
      </ul>
    </main>
  );
}
