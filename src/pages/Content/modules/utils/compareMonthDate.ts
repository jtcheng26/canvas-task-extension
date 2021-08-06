export default function CompareMonthDate(a: Date, b: Date) {
  return a.getMonth() == b.getMonth() && a.getDate() == b.getDate();
}
