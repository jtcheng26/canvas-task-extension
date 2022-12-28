import { FinalAssignment } from '../../../types';
import apiReq from '../../../utils/apiReq';

/* Mark an assignment either complete or incomplete via planner overrides.*/
export default function deleteAssignment(assignment: FinalAssignment): void {
  const json = JSON.stringify({
    id: assignment.plannable_id,
  });
  apiReq('/v1/planner_notes/' + assignment.plannable_id, json, 'delete');
}
