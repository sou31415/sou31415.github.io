import Link from "next/link";
import type { BlogPostSummary } from "../../../lib/blog";
import { formatPostDate, formatReadingTime } from "../../../lib/blog/presentation";
import { BlogShell } from "./BlogShell";

export function BlogIndex({ posts }: { posts: BlogPostSummary[] }) {
  return (
    <BlogShell>
      <main id="main-content" className="blog-index" tabIndex={-1}>
        <header className="index-heading">
          <h1>Blog</h1>
          <p>活動、学び、考えたことを書いています。</p>
        </header>
        <section aria-label="記事一覧">
          {posts.length > 0 ? (
            <ul className="post-list">
              {posts.map((post) => (
                <li key={post.slug} className="post-row">
                  <article>
                    <time className="post-date" dateTime={post.date}>
                      {formatPostDate(post.date)}
                    </time>
                    <div className="post-row__content">
                      <h2>
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>
                      {post.description ? <p className="post-description">{post.description}</p> : null}
                      <div className="post-details">
                        <span>{formatReadingTime(post.readingTime)}</span>
                        {post.tags.length > 0 ? (
                          <ul className="post-tags" aria-label="タグ">
                            {post.tags.map((tag) => <li key={tag}>#{tag}</li>)}
                          </ul>
                        ) : null}
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-posts">まだ記事はありません。</p>
          )}
        </section>
        <aside className="author-note" aria-label="書き手について">
          <p>sou31415</p>
          <p>Webバックエンド、Beatbox、ループステーション、写真が好き。</p>
        </aside>
      </main>
    </BlogShell>
  );
}
