import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { BlogPostArticle } from "../_components/BlogPostArticle";
import { getPostBySlug } from "../../../lib/blog";

export const dynamic = "force-dynamic";

type BlogPostPageParams = {
  slug: string[];
};

const getArticle = cache((slug: string) => {
  const post = getPostBySlug(slug);
  if (!post) notFound();
  return post;
});

function articleSlug(segments: string[]): string {
  // Next.js 14 supplies encoded segments to App Router pages.
  const decoded = segments.map((segment) => decodeURIComponent(segment));
  if (decoded.some((segment) => segment.includes("/"))) notFound();
  return decoded.join("/");
}

export function generateMetadata({ params }: { params: BlogPostPageParams }): Metadata {
  const post = getArticle(articleSlug(params.slug));
  return {
    title: post.title,
    description: post.description || undefined
  };
}

export default function BlogPostPage({ params }: { params: BlogPostPageParams }) {
  return <BlogPostArticle post={getArticle(articleSlug(params.slug))} />;
}
