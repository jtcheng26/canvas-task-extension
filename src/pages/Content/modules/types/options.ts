type Period = 'Day' | 'Week' | 'Month';

interface Options {
  startDate: number;
  startHour: number;
  startMinutes: number;
  period: Period;
  sidebar: boolean;
  dash_courses: boolean;
}

export default Options;
