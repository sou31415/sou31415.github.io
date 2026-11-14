import Link from "next/link";
import type { BlogPost } from "../../../lib/blog/types";
import { formatPostDate } from "../../../lib/blog/presentation";
import { BlogShell } from "./BlogShell";

export function BlogPostArticle({ post }: { post: BlogPost }) {
  return (
    <BlogShell>
      <main id="main-content" className="blog-post" tabIndex={-1}>
        <Link className="back-link" href="/">← 記事一覧</Link>
        <article>
          <header className="post-heading">
            <div className="post-details">
              <time className="post-date" dateTime={post.date}>{formatPostDate(post.date)}</time>
            </div>
            <h1>{post.title}</h1>
            {post.tags.length > 0 ? (
              <ul className="post-tags" aria-label="タグ">
                {post.tags.map((tag) => <li key={tag}>#{tag}</li>)}
              </ul>
            ) : null}
          </header>
          <div className="blog-markdown" dangerouslySetInnerHTML={{ __html: post.html }} />
        </article>
        <footer className="post-footer">
          <Link className="back-link" href="/">← 記事一覧に戻る</Link>
        </footer>
      </main>
    </BlogShell>
  );
}
