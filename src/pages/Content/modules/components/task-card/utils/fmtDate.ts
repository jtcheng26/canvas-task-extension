/* Return the Feb 26, 8:00 PM format of the ISO string. */
export default function fmtDate(date: string): [string, string] {
  const as_date = new Date(date);
  const fmted_date = as_date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const fmted_time = as_date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
  return [fmted_date, fmted_time];
}
