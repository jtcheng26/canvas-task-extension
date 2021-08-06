/*
  functions to get the start and end of the current day
*/
export function getDayStart() {
  const d = new Date();
  d.setHours(0, 0, 0);
  return d;
}
export function getDayEnd() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0);
  return d;
}
