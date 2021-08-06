/*
  functions to get the start and end of the current month
*/
export function getMonthStart(): Date {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0);
  return d;
}
export function getMonthEnd(): Date {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() + 1);
  d.setHours(0, 0, 0);
  return d;
}
