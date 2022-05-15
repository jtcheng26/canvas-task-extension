import { filterCourses } from '../../../hooks/useAssignments';
import { FinalAssignment } from '../../../types';

export default function useSelectedCourse(
  selectedCourseId: number,
  assignments: FinalAssignment[]
): FinalAssignment[] {
  return selectedCourseId != -1
    ? filterCourses([selectedCourseId], assignments)
    : assignments;
}
