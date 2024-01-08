import { AssignmentType, FinalAssignment } from '../../../types';
import assignmentIsDone from '../../../utils/assignmentIsDone';

export function ringProgress(assignment: FinalAssignment): number {
  if (assignment.total_submissions && assignment.type !== AssignmentType.NOTE)
    return (
      assignment.total_submissions -
      (assignment.needs_grading_count || assignment.total_submissions)
    );
  return assignmentIsDone(assignment) ? 1 : 0;
}
