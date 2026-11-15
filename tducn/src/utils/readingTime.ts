// ponytail: Minimalist reading time calculation, zero dependencies
export function getReadingTime(content: string = ''): string {
  if (!content) return '1 min read';
  // Strip code blocks and markdown symbols for cleaner word count
  const cleanContent = content.replace(/^---[\s\S]*?---/, '').trim();
  const words = cleanContent.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}
