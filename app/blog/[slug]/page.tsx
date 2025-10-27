import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostArticle } from "../_components/BlogPostArticle";
import {
  buildBlogPostMetadata,
  getMissingPostMetadata
} from "../../../lib/blog/metadata";
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
    return getMissingPostMetadata();
  }

  return buildBlogPostMetadata(post);
}

export default function BlogPostPage({ params }: { params: BlogPostPageParams }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return <BlogPostArticle post={post} />;
}
