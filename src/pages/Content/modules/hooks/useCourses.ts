import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { THEME_COLOR } from '../constants';
import { DemoCourses } from '../tests/demo';
import { Course } from '../types';
import baseURL from '../utils/baseURL';
import useCourseColors from './useCourseColors';

/* Apply the `color` property to each course. */
function applyColor(
  colors: Record<string, string>,
  courses: Course[]
): Course[] {
  return courses.map((course) => {
    course.color = course.id in colors ? colors[course.id] : THEME_COLOR;
    return course;
  });
}

const CustomCourse: Course = {
  id: 0,
  color: THEME_COLOR,
  position: 0,
  name: 'Custom Task',
  course_code: 'Custom Task',
};

/* Get all courses (200 limit for now, will change to paginate in the future) */
async function getCourses(colors: Record<string, string>): Promise<Course[]> {
  if (process.env.DEMO) return DemoCourses;

  const { data } = await axios.get(`${baseURL()}/api/v1/courses?per_page=200`);

  return [CustomCourse].concat(
    applyColor(
      colors,
      data.filter((course: Course) => {
        return !course.access_restricted_by_date;
      })
    )
  );
}

/* Use cached course data */
export default function useCourses(): UseQueryResult<Course[]> {
  const { data: colors } = useCourseColors();
  return useQuery(
    'courses',
    () => getCourses(colors as Record<string, string>),
    { staleTime: Infinity, enabled: !!colors }
  );
}
