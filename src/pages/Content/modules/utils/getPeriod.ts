import { Period } from '../types';
import { getMonthStart, getMonthEnd } from '../utils/getMonth';
import { getWeekStart, getWeekEnd } from '../utils/getWeek';
import { getDayStart, getDayEnd } from '../utils/getDay';

export default function getPeriod(
  period: Period,
  startDate: number,
  startHours: number,
  startMinutes: number,
  delta: number
): { start: Date; end: Date } {
  let prevPeriodStart = getMonthStart();
  let nextPeriodStart = getMonthEnd();
  /*
    set time period based on user-selected options and set delta based on current period
  */
  switch (period) {
    case 'Month':
      prevPeriodStart.setMonth(prevPeriodStart.getMonth() + delta);
      nextPeriodStart.setMonth(nextPeriodStart.getMonth() + delta);
      break;
    case 'Day':
      prevPeriodStart = getDayStart();
      nextPeriodStart = getDayEnd();
      prevPeriodStart.setDate(prevPeriodStart.getDate() + delta);
      nextPeriodStart.setDate(nextPeriodStart.getDate() + delta);
      break;
    default:
      prevPeriodStart = getWeekStart(startDate);
      nextPeriodStart = getWeekEnd(startDate);
      prevPeriodStart.setDate(prevPeriodStart.getDate() + 7 * delta);
      nextPeriodStart.setDate(nextPeriodStart.getDate() + 7 * delta);
      break;
  }

  prevPeriodStart.setHours(startHours);
  prevPeriodStart.setMinutes(startMinutes);

  nextPeriodStart.setHours(startHours);
  nextPeriodStart.setMinutes(startMinutes);

  return { start: prevPeriodStart, end: nextPeriodStart };
}
