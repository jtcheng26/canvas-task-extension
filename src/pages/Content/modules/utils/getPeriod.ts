import { Period } from '../types';

/*
  functions to get the start and end of the current day
*/
export function getDayStart(): Date {
  const d = new Date();
  d.setHours(0, 0, 0);
  return d;
}
export function getDayEnd(startDate: Date): Date {
  const d = new Date(startDate);
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0);
  return d;
}

export function getThreeDayStart(): Date {
  const d = new Date();
  d.setHours(0, 0, 0);
  return d;
}
export function getThreeDayEnd(startDate: Date): Date {
  const d = new Date(startDate);
  d.setDate(d.getDate() + 3);
  d.setHours(0, 0, 0);
  return d;
}

/*
  functions to get the previous and next occurence of a specific day of the week
*/

export function getWeekStart(startDate: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - ((d.getDay() - startDate + 7) % 7));
  d.setHours(0, 0, 0);
  return d;
}
export function getWeekEnd(startDate: Date): Date {
  const d = new Date(startDate);
  d.setDate(d.getDate() + 7);
  d.setHours(0, 0, 0);
  return d;
}

/*
  functions to get the start and end of the current month
*/
export function getMonthStart(): Date {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0);
  return d;
}
export function getMonthEnd(startDate?: Date): Date {
  if (startDate) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + 30);
    d.setHours(0, 0, 0);
    return d;
  }
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() + 1);
  d.setHours(0, 0, 0);
  return d;
}

export default function getPeriod(
  period: Period,
  startDate: number,
  startHours: number,
  startMinutes: number,
  delta: number,
  rollingPeriod?: boolean
): { start: Date; end: Date } {
  let prevPeriodStart = getMonthStart();
  let nextPeriodStart = getMonthEnd();

  if (rollingPeriod) {
    prevPeriodStart = new Date();
    prevPeriodStart.setHours(0, 0, 0);
    if (period == 'Month') nextPeriodStart = getMonthEnd(prevPeriodStart);
  } else {
    switch (period) {
      case 'Month':
        break;
      case 'ThreeDay':
        prevPeriodStart = getThreeDayStart();
        break;
      case 'Day':
        prevPeriodStart = getDayStart();
        break;
      default:
        prevPeriodStart = getWeekStart(startDate);
        break;
    }
  }

  /*
    set time period based on user-selected options and set delta based on current period
  */
  switch (period) {
    case 'Month':
      prevPeriodStart.setMonth(prevPeriodStart.getMonth() + delta);
      nextPeriodStart.setMonth(nextPeriodStart.getMonth() + delta);
      break;
    case 'ThreeDay':
      nextPeriodStart = getThreeDayEnd(prevPeriodStart);
      prevPeriodStart.setDate(prevPeriodStart.getDate() + delta);
      nextPeriodStart.setDate(nextPeriodStart.getDate() + delta);
      break;
    case 'Day':
      nextPeriodStart = getDayEnd(prevPeriodStart);
      prevPeriodStart.setDate(prevPeriodStart.getDate() + delta);
      nextPeriodStart.setDate(nextPeriodStart.getDate() + delta);
      break;
    default:
      nextPeriodStart = getWeekEnd(prevPeriodStart);
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
