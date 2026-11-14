export function formatPostDate(date: string): string {
  return date.replace(/-/g, ".");
}

export function formatReadingTime(readingTime: string): string {
  const match = readingTime.match(/^(\d+) mins? read$/);
  return match ? `${match[1]}分で読めます` : readingTime;
}
