const longDate = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

/** "12 October 2026" */
export function formatDate(date: Date): string {
  return longDate.format(date);
}

/** "2026-10-12", for <time datetime> */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

const monthYear = new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' });

/** "2024-10" -> "Oct 2024" */
export function formatMonth(yyyyMm: string): string {
  return monthYear.format(new Date(`${yyyyMm}-01T00:00:00Z`));
}
