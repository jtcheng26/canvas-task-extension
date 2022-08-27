import { FinalAssignment } from '../../../types';
import postReq from '../../../utils/postReq';

/* Mark an assignment either complete or incomplete via planner overrides.*/
export default async function markAssignment(
  complete: boolean,
  assignment: FinalAssignment
): Promise<void> {
  const json = JSON.stringify({
    plannable_type: assignment.type.toString(),
    plannable_id: assignment.plannable_id,
    marked_complete: complete,
  });
  await postReq('/v1/planner/overrides', json);
}
