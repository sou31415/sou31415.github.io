import { BlogIndex } from "./blog/_components/BlogIndex";
import { getAllPosts } from "../lib/blog";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return <BlogIndex posts={getAllPosts()} />;
}
