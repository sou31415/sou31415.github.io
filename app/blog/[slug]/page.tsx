import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostArticle } from "../_components/BlogPostArticle";
import { getAllPosts, getPostBySlug } from "../../../lib/blog/posts";

type BlogPostPageParams = {
  slug: string;
};

export function generateStaticParams(): BlogPostPageParams[] {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: BlogPostPageParams }): Metadata {
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

export default function BlogPostPage({ params }: { params: BlogPostPageParams }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return <BlogPostArticle post={post} />;
}
