import { FinalAssignment } from '../../../types';

export default function isComplete(assignment: FinalAssignment): boolean {
  return (
    assignment.marked_complete || assignment.submitted || assignment.graded
  );
}
