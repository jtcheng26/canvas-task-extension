export interface Bar {
  id: string;
  value: number;
  max: number;
  color: string;
}

export default interface ChartData {
  bars: Bar[];
  key?: string;
}
