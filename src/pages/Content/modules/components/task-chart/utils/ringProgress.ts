import { AssignmentType, FinalAssignment } from '../../../types';

export function ringProgress(assignment: FinalAssignment): 1 | 0 {
  if (
    assignment.points_possible == 0 &&
    assignment.type !== AssignmentType.NOTE
  )
    return 0;
  return assignment.submitted || assignment.graded || assignment.marked_complete
    ? 1
    : 0;
}
