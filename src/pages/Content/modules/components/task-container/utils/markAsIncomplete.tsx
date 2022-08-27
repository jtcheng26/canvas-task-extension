import { FinalAssignment } from '../../../types';
import markAssignment from './markAssignment';

export default function markAsIncomplete(
  assignment: FinalAssignment
): FinalAssignment {
  assignment.marked_complete = false;
  markAssignment(false, assignment);
  return assignment;
}
