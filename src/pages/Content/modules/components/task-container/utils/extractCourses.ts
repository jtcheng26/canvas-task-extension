import { AssignmentType, FinalAssignment } from '../../../types';

/* Returns a list of course ids from a list of `Assignment` objects. */
export default function extractCourses(
  assignments: FinalAssignment[]
): string[] {
  return Array.from(
    assignments.reduce((a: Set<string>, b: FinalAssignment) => {
      if (b.type !== AssignmentType.ANNOUNCEMENT) {
        a.add(b.course_id);
      }
      return a;
    }, new Set())
  );
}
