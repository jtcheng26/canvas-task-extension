import { FinalAssignment } from '../../../types';
import deleteReq from '../../../utils/deleteReq';

/* Mark an assignment either complete or incomplete via planner overrides.*/
export default function deleteAssignment(assignment: FinalAssignment): void {
  const json = JSON.stringify({
    id: assignment.plannable_id,
  });
  deleteReq('/v1/planner_notes/' + assignment.plannable_id, json);
}
