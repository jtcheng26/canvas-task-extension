import { FinalAssignment } from '../../../types';

/* Sort by position first then course id. */
export default function sortByPosition(
  assignments: FinalAssignment[]
): FinalAssignment[] {
  return assignments.sort((a, b) => {
    if (a.position == b.position) return a.course_id > b.course_id ? 1 : -1;
    else return (a.position ? a.position : 0) - (b.position ? b.position : 0);
  });
}
