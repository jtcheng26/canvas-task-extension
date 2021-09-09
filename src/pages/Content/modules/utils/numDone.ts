import { Assignment } from '../types';
import pointsPossible from './pointsPossible';

export function ringProgress(assignment: Assignment): 1 | 0 {
  if (!pointsPossible(assignment)) return 0;
  return assignment.user_submitted || (assignment.grade && assignment.grade > 0)
    ? 1
    : 0;
}

export default function numDone(assignments: Assignment[]): number {
  return assignments.reduce((c, d) => {
    return c + ringProgress(d);
  }, 0);
}
