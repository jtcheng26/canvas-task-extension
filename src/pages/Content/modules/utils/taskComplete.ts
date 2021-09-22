import { Assignment } from '../types';

export default function taskComplete(assignment: Assignment): boolean {
  return (
    assignment.canvas_tasks_marked_as_complete ||
    assignment.user_submitted ||
    (assignment.grade ? true : false)
  );
}
