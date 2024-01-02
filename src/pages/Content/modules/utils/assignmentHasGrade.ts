import { FinalAssignment } from '../types';

// whether the assignment has a grade (inputted by instructor) to display
// this is unique from the "graded" field, which just tells whether it should appear in the "completed" tab
export default function assignmentHasGrade(
  assignment: FinalAssignment
): boolean {
  return assignment.graded || !!assignment.grade || !!assignment.graded_at;
}
