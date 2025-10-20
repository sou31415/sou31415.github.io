import { post as testPost } from "./(posts)/test/page";
import { post as Birthday21Post } from "./(posts)/Birthday21/page"

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
  Birthday21Post,
  testPost
];

const postsBySlug = posts.reduce<Record<string, BlogPost>>((acc, post) => {
  acc[post.slug] = post;
  return acc;
}, {});

export function getPostBySlug(slug: string) {
  return postsBySlug[slug];
}
