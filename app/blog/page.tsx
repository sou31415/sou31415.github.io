import { BlogIndex } from "./_components/BlogIndex";
import { getAllPosts } from "../../lib/blog";

export default function BlogIndexPage() {
  return <BlogIndex posts={getAllPosts()} />;
}
