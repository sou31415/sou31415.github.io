import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, posts } from "../posts";

type BlogPostPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "記事が見つかりません",
      description: "指定されたブログ記事は存在しません。"
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date
    }
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

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
