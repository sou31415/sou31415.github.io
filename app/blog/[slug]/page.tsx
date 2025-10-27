import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostArticle } from "../_components/BlogPostArticle";
import { resolveBlogPost } from "../../../lib/blog/queries";
import { getAllPosts } from "../../../lib/blog/posts";

type BlogPostPageParams = {
  slug: string;
};

export function generateStaticParams(): BlogPostPageParams[] {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: BlogPostPageParams }): Metadata {
  return resolveBlogPost(params.slug).metadata;
}

export default function BlogPostPage({ params }: { params: BlogPostPageParams }) {
  const { post } = resolveBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  return <BlogPostArticle post={post} />;
}
