import { FinalAssignment } from '../../../types';
import { AssignmentStatus } from '../../../types/assignment';
import postReq from '../../../utils/postReq';
import deleteAssignment from './deleteAssignment';

/* Mark an assignment either complete or incomplete via planner overrides.*/
export default function markAssignment(
  complete: AssignmentStatus,
  assignment: FinalAssignment
): FinalAssignment {
  if (complete === 'deleted') deleteAssignment(assignment);
  else {
    const json = JSON.stringify({
      plannable_type: assignment.type.toString(),
      plannable_id: assignment.plannable_id,
      marked_complete: complete,
    });
    postReq(
      '/v1/planner/overrides',
      json,
      !!assignment.override_id,
      assignment.override_id + ''
    );
    assignment.marked_complete = complete === AssignmentStatus.COMPLETE;
  }
  return assignment;
}
