// Frontmatter dates are calendar days (parsed as UTC midnight), so format
// in UTC — otherwise a build in a US timezone shows the previous day.
const formatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

export const formatDate = (d: Date) => formatter.format(d);
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);
