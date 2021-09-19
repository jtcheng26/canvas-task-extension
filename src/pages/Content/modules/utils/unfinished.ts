import { Assignment } from '../types';
import { ringProgress } from './numDone';

export default function unfinished(assignments: Assignment[]): Assignment[] {
  return assignments.filter((assignment: Assignment) => {
    return !assignment.user_submitted && ringProgress(assignment) == 0;
  });
}
