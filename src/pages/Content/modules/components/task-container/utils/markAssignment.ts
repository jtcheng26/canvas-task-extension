import axios from 'axios';
import { FinalAssignment } from '../../../types';
import baseURL from '../../../utils/baseURL';

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
  const CSRFtoken = function () {
    return decodeURIComponent(
      (document.cookie.match('(^|;) *_csrf_token=([^;]*)') || '')[2]
    );
  };
  await axios.post(`${baseURL()}/api/v1/planner/overrides`, json, {
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': CSRFtoken(),
    },
  });
}
