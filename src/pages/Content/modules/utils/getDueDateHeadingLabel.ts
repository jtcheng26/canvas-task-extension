const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export default function getDueDateHeadingLabel(delta: number): string {
  if (delta < 0) return 'Overdue';
  if (delta == 0) return 'Today';
  else if (delta == 1) return 'Tomorrow';
  else if (delta < 7) return days[(new Date(Date.now()).getDay() + delta) % 7];
  else if (delta < 14) return '1 week';
  else return `${Math.floor(delta / 7)} weeks`;
}
