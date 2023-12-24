import { CourseStoreInterface } from '../../../hooks/useCourseStore';
import { FinalAssignment } from '../../../types';

/* Sort by position first then course id. */
export default function sortByPosition(
  assignments: FinalAssignment[],
  courseStore: CourseStoreInterface
): FinalAssignment[] {
  return assignments.sort((a, b) => {
    const ap = courseStore.state[a.course_id].position;
    const bp = courseStore.state[b.course_id].position;
    if (ap == bp) return a.course_id > b.course_id ? 1 : -1;
    else return (ap ? ap : 0) - (bp ? bp : 0);
  });
}
