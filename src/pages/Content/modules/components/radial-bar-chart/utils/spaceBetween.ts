/* Return the space between rings. Optimally <10 rings. */
export default function computeSpaceBetween(barCnt: number): number {
  if (barCnt <= 1) return 40;
  if (barCnt <= 3) return 15;
  if (barCnt <= 5) return 8;
  if (barCnt <= 8) return 5;
  if (barCnt <= 11) return 3;
  return 2;
}
