import { FinalAssignment } from '../../../types';
import postReq from '../../../utils/postReq';

/* Mark an assignment either complete or incomplete via planner overrides.*/
export default function markAssignment(
  complete: boolean,
  assignment: FinalAssignment
): FinalAssignment {
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
  assignment.marked_complete = complete;
  return assignment;
}
