import { AssignmentDefaults } from '../../../constants';
import { CourseStoreInterface } from '../../../hooks/useCourseStore';
import { FinalAssignment } from '../../../types';
import { Bar, ChartData } from '../../radial-bar-chart';
import { ringProgress } from '../utils/ringProgress';
import sortByPosition from '../utils/sortByPosition';

export default function useChartData(
  assignments: FinalAssignment[],
  courses: string[],
  courseStore: CourseStoreInterface,
  defaultColor: string,
  key = ''
): ChartData {
  const EMPTY_COURSE_ID = 'TASKS_FOR_CANVAS_EMPTY_COURSE';
  const courseExists: Record<string, number> = {};
  const tempAssignments: FinalAssignment[] = assignments.slice();
  assignments.forEach((a) => {
    courseExists[a.course_id] = 1;
  });
  courses.forEach((c) => {
    if (!courseExists[c] && c !== '0') {
      tempAssignments.push({
        ...AssignmentDefaults,
        course_id: c,
        name: EMPTY_COURSE_ID,
      });
    }
  });
  const sortedAssignments = sortByPosition(tempAssignments, courseStore);
  const data: ChartData = {
    bars: sortedAssignments.reduce((a: Bar[], b: FinalAssignment) => {
      if (b.name === EMPTY_COURSE_ID) {
        a.push({
          id: b.course_id,
          value: 0,
          max: 0,
          color: courseStore.state[b.course_id].color,
        });
        return a;
      }

      if (a.length == 0 || a[a.length - 1].id !== b.course_id) {
        a.push({
          id: b.course_id,
          value: 0,
          max: 0,
          color: courseStore.state[b.course_id].color || '#000000',
        });
      }

      a[a.length - 1].value += ringProgress(b);
      if (b.total_submissions) {
        a[a.length - 1].max += b.total_submissions;
      } else {
        a[a.length - 1].max += 1; // Just include everything for clarity/simplicty
      }
      return a;
    }, []),
    key: key,
  };

  if (data.bars.length === 0)
    data.bars.push({
      id: '',
      value: 0,
      max: 0,
      color: defaultColor,
    });
  return data;
}
