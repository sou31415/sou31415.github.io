import Link from "next/link";
import type { BlogPost } from "../posts";

type BlogPostArticleProps = {
  post: BlogPost;
};

export function BlogPostArticle({ post }: BlogPostArticleProps) {
  return (
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
          <ul className="blog-post__tags" aria-label="タグ">
            {post.tags.map((tag) => (
              <li key={tag}>#{tag}</li>
            ))}
          </ul>
        </header>
        <div className="blog-post__body">
          {post.body.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>
    </main>
  );
}
