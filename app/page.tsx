import { BlogIndex } from "./blog/_components/BlogIndex";
import { getAllPosts } from "../lib/blog";

export default function HomePage() {
  return <BlogIndex posts={getAllPosts()} />;
}
