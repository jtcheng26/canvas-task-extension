interface Bar {
  id: number;
  value: number;
  color: string;
}

export default interface ChartData {
  bars: Bar[];
  max: number;
}
