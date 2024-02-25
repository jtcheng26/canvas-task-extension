import { FinalAssignment } from '../../../types';
import { AssignmentStatus } from '../../../types/assignment';
import { setGradescopeOverride } from '../../gradescope/utils/store';

/* Mark an assignment either complete or incomplete via planner overrides.*/
export default function markGradescopeAssignment(
  complete: AssignmentStatus,
  assignment: FinalAssignment
): FinalAssignment {
  if (complete === AssignmentStatus.SEEN) return assignment; // shouldn't happen, just needed to make TS happy
  const retAssignment = { ...assignment };
  if (complete === AssignmentStatus.COMPLETE) {
    retAssignment.marked_complete = true;
  } else if (complete === AssignmentStatus.UNFINISHED) {
    retAssignment.marked_complete = false;
    retAssignment.submitted = false;
    retAssignment.graded = false;
  }
  setGradescopeOverride(
    assignment.id,
    assignment.plannable_id,
    assignment.name,
    assignment.due_at,
    complete
  );
  return retAssignment;
}
