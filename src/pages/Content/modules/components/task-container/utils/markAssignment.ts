import { FinalAssignment } from '../../../types';
import { AssignmentStatus } from '../../../types/assignment';
import apiReq from '../../../utils/apiReq';
import deleteAssignment from './deleteAssignment';

/* Mark an assignment either complete or incomplete via planner overrides.*/
export default function markAssignment(
  complete: AssignmentStatus,
  assignment: FinalAssignment
): FinalAssignment {
  const method = assignment.override_id ? 'put' : 'post';
  if (complete === AssignmentStatus.DELETED) deleteAssignment(assignment);
  else if (complete === AssignmentStatus.SEEN) {
    apiReq(
      `/v1/courses/${assignment.course_id}/discussion_topics/${assignment.id}`,
      '',
      'put',
      'read'
    );
    assignment.marked_complete = true;
  } else {
    const json = JSON.stringify({
      plannable_type: assignment.type.toString(),
      plannable_id: assignment.plannable_id,
      marked_complete: complete === AssignmentStatus.COMPLETE,
    });
    apiReq('/v1/planner/overrides', json, method, assignment.override_id + '');
    assignment.marked_complete = complete === AssignmentStatus.COMPLETE;
    if (complete === AssignmentStatus.UNFINISHED && !assignment.override_id)
      assignment.override_id = '0';
  }
  return assignment;
}
