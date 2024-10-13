export type Period = 'Day' | 'ThreeDay' | 'Week' | 'Month';

type Options = {
  color_tabs: boolean;
  complete_assignments?: number[];
  rolling_period: boolean;
  start_date: number;
  start_hour: number;
  start_minutes: number;
  period: Period;
  sidebar: boolean;
  dash_courses: boolean;
  due_date_headings: boolean;
  show_locked_assignments: boolean;
  show_confetti: boolean;
  theme_color: string;
  dark_mode: boolean;
  show_needs_grading: boolean;
  show_long_overdue: boolean;
  GSCOPE_INT_disabled: boolean;
  clock_24hr: boolean;
};

export default Options;
