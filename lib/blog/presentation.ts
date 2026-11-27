export function formatPostDate(date: string): string {
  return date.replace(/-/g, ".");
}

export function blogPostHref(slug: string): string {
  return `/blog/${slug.split("/").map(encodeURIComponent).join("/")}`;
}
