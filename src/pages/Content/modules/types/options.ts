interface Options {
  startDate: number;
  startHour: number;
  startMinutes: number;
  period: 'Day' | 'Week' | 'Month';
  sidebar: boolean;
  dash_courses: boolean;
}

export default Options;
