export default function CompareMonthDate(a: Date, b: Date): boolean {
  return a.getMonth() == b.getMonth() && a.getDate() == b.getDate();
}
