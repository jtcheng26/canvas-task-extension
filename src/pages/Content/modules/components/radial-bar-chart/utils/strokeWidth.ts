/* Return the width of each ring. */
export default function computeStrokeWidth(
  barCnt: number,
  radius: number,
  cutout: number,
  spaceBtw: number
): number {
  if (barCnt === 1) return 40;
  return (radius - cutout - barCnt * spaceBtw) / barCnt;
}
