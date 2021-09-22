import { Assignment } from '../types';
import pointsPossible from './pointsPossible';
import taskComplete from './taskComplete';

export function ringProgress(assignment: Assignment): 1 | 0 {
  if (!pointsPossible(assignment)) return 0;
  return taskComplete(assignment) ? 1 : 0;
}

export default function numDone(assignments: Assignment[]): number {
  return assignments.reduce((c, d) => {
    return c + ringProgress(d);
  }, 0);
}
