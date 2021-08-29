import { Assignment } from '../types';

export default function numTotal(assignments: Assignment[]): number {
  return assignments.reduce((a, b) => a + (b.points_possible === 0 ? 0 : 1), 0);
}
