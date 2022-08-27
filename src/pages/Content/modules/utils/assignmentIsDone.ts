import { FinalAssignment } from '../types';

export default function assignmentIsDone(assignment: FinalAssignment): boolean {
  return assignment.override_id
    ? assignment.marked_complete
    : assignment.marked_complete || assignment.submitted || assignment.graded;
}
