import { Assignment } from '../types';
import pointsPossible from './pointsPossible';

export default function numTotal(assignments: Assignment[]): number {
  return assignments.reduce((a, b) => a + (!pointsPossible(b) ? 0 : 1), 0);
}
