import { Assignment } from '../types';
import taskComplete from './taskComplete';

export default function finished(assignments: Assignment[]): Assignment[] {
  return assignments.filter((assignment: Assignment) => {
    return taskComplete(assignment);
  });
}
