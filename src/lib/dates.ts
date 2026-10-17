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

// Fixed three-letter months, as written in the CV. Intl's en-GB short month
// is "Sept" in current ICU data, which would no longer match the CV.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2024-10" -> "Oct 2024" */
export function formatMonth(yyyyMm: string): string {
  const [year, month] = yyyyMm.split('-').map(Number);
  return `${MONTHS[month - 1]} ${year}`;
}
