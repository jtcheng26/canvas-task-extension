import { Assignment } from '../types';
import { ringProgress } from './numDone';

export default function taskComplete(assignment: Assignment): boolean {
  return (
    assignment.canvas_tasks_marked_as_complete ||
    !(!assignment.user_submitted && ringProgress(assignment) == 0)
  );
}
