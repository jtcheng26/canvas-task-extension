/* Return the stroke radius of the rings. */
export default function computeStrokeRadius(
  barCnt: number,
  radius: number,
  cutout: number,
  strokeWidth: number
): number {
  if (barCnt === 1) return cutout;
  return (radius - cutout - strokeWidth / 2) / barCnt;
}
