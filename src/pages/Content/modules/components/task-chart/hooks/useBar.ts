import { ChartData } from '../../radial-bar-chart';

/* Return done, total, and color values for the selected bar, or all bars if none selected. */
export default function useSelectChartData(
  selectedCourseId: string,
  chartData: ChartData
): [number, number, string] {
  const selectBar = chartData.bars.filter((bar) => bar.id == selectedCourseId);
  if (selectBar.length == 0) {
    return chartData.bars.reduce(
      (a: [number, number, string], b) => {
        a[0] += b.value;
        a[1] += b.max;
        return a;
      },
      [0, 0, 'inherit']
    );
  }
  return [selectBar[0].value, selectBar[0].max, selectBar[0].color];
}
