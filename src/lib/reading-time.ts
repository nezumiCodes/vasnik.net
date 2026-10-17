const WORDS_PER_MINUTE = 200;

/** Whole minutes to read a Markdown body, at least 1. Markup and URLs are not counted. */
export function readingMinutes(markdown: string): number {
  const text = markdown
    .replace(/<[^>]+>/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`|~]+/g, ' ');
  const words = text.match(/[\p{L}\p{N}][\p{L}\p{N}'’.-]*/gu)?.length ?? 0;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** "6 min read" */
export function formatReadingTime(markdown: string): string {
  return `${readingMinutes(markdown)} min read`;
}
