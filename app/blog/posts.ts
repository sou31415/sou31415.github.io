import { post as portfolioRefreshPost } from "./(posts)/portfolio-refresh-2024/page";
import { post as rustBackendMemoPost } from "./(posts)/rust-backend-memo/page";
import { post as studyNoteGrowthMindsetPost } from "./(posts)/study-note-growth-mindset/page";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  tags: string[];
  body: string[];
};

export const posts: BlogPost[] = [
  portfolioRefreshPost,
  rustBackendMemoPost,
  studyNoteGrowthMindsetPost
];

const postsBySlug = posts.reduce<Record<string, BlogPost>>((acc, post) => {
  acc[post.slug] = post;
  return acc;
}, {});

export function getPostBySlug(slug: string) {
  return postsBySlug[slug];
}
