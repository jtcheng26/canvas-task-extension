export type Period = 'Day' | 'Week' | 'Month';

interface Options {
  startDate: number;
  startHour: number;
  startMinutes: number;
  period: Period;
  sidebar: boolean;
  dash_courses: boolean;
  due_date_headings: boolean;
  show_locked_assignments: boolean;
}

export default Options;
