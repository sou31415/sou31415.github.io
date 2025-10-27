import Link from "next/link";
import type { BlogPost } from "../../../lib/blog/types";

export function BlogPostArticle({ post }: { post: BlogPost }) {
  return (
    <div className="blog-page">
      <main className="blog-post">
        <Link className="blog-post__back" href="/blog">
          ← 記事一覧に戻る
        </Link>
        <article>
          <header className="blog-post__header">
            <p className="blog-post__meta">
              <time dateTime={post.date}>{post.date}</time>
              <span aria-hidden="true">・</span>
              <span>{post.readingTime}</span>
            </p>
            <h1>{post.title}</h1>
            {post.tags.length > 0 && (
              <ul className="blog-post__tags" aria-label="タグ">
                {post.tags.map((tag) => (
                  <li key={tag}>#{tag}</li>
                ))}
              </ul>
            )}
          </header>
          <div className="blog-post__body">
            {post.body.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>
      </main>
    </div>
  );
}
