import { filterCourses } from '../../../plugins/shared/useAssignments';
import { FinalAssignment } from '../../../types';

export default function useSelectedCourse(
  selectedCourseId: string,
  assignments: FinalAssignment[]
): FinalAssignment[] {
  return selectedCourseId !== ''
    ? filterCourses([selectedCourseId], assignments)
    : assignments;
}
