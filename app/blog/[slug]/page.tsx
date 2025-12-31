import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostArticle } from "../_components/BlogPostArticle";
import { getAllSlugs, getPostBySlug } from "../../../lib/blog";

type BlogPostPageParams = {
  slug: string;
};

export function generateStaticParams(): BlogPostPageParams[] {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: BlogPostPageParams }): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) {
    return { title: "Not Found" };
  }

  return {
    title: post.title,
    description: post.description || undefined
  };
}

export default function BlogPostPage({ params }: { params: BlogPostPageParams }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return <BlogPostArticle post={post} />;
}
