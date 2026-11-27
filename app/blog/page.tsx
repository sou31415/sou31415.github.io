import { BlogIndex } from "./_components/BlogIndex";
import { getAllPosts } from "../../lib/blog";

export const dynamic = "force-dynamic";

export default function BlogIndexPage() {
  return <BlogIndex posts={getAllPosts()} />;
}
