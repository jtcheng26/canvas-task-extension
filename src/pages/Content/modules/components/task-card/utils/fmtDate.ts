/* Return the Feb 26, 8:00 PM format of the ISO string. */
export default function fmtDate(
  date: string,
  clock24hr: boolean
): [string, string] {
  const as_date = new Date(date);
  const fmted_date = as_date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const fmted_time = as_date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: !clock24hr,
  });
  return [fmted_date, fmted_time];
}

export function fmtDateSince(date: string): string {
  const announced = new Date(date).getTime();
  const now = Date.now();
  const MINUTE = 1000 * 60;
  const HOUR = MINUTE * 60;
  const DAY = HOUR * 24;
  const WEEK = 7 * DAY;
  const diff = now - announced;
  let res = [0, ''];
  if (diff > WEEK) res = [diff / WEEK, 'week'];
  else if (diff > DAY) res = [diff / DAY, 'day'];
  else if (diff > HOUR) res = [diff / HOUR, 'hour'];
  else res = [diff / MINUTE, 'min'];
  return `${Math.floor(res[0] as number)} ${res[1]}${
    Math.floor(res[0] as number) !== 1 ? 's' : ''
  } ago`;
}
