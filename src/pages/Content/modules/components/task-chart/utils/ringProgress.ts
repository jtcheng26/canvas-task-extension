import { AssignmentType, FinalAssignment } from '../../../types';
import assignmentIsDone from '../../../utils/assignmentIsDone';

export function ringProgress(assignment: FinalAssignment): 1 | 0 {
  if (
    assignment.points_possible == 0 &&
    assignment.type !== AssignmentType.NOTE
  )
    return 0;
  return assignmentIsDone(assignment) ? 1 : 0;
}
