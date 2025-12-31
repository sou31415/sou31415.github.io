export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  tags: string[];
  html: string;
};

export type BlogPostSummary = Omit<BlogPost, "html">;
