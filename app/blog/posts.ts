import { post as testPost } from "./(posts)/test/page";

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
  testPost
];

const postsBySlug = posts.reduce<Record<string, BlogPost>>((acc, post) => {
  acc[post.slug] = post;
  return acc;
}, {});

export function getPostBySlug(slug: string) {
  return postsBySlug[slug];
}
