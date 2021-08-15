interface Bar {
  id: number;
  value: number;
  max: number;
  color: string;
}

export default interface ChartData {
  bars: Bar[];
}
