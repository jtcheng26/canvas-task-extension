import { useQuery, UseQueryResult } from 'react-query';
import { DemoNames } from '../tests/demo';
import { Course } from '../types';
import isDemo from '../utils/isDemo';
import useCourses from './useCourses';

/* In case we want to use user-chosen names in the future, which would require another api request. */
async function getCourseNames(
  courses: Course[]
): Promise<Record<string, string>> {
  if (isDemo()) return DemoNames;

  const names: Record<string, string> = {};
  courses.forEach((course: Course) => {
    names[course.id] = course.original_name
      ? (course.name as string)
      : (course.course_code as string);
  });
  return names;
}

export default function useCourseNames(): UseQueryResult<
  Record<string, string>
> {
  const { data: courses } = useCourses();
  return useQuery('names', () => getCourseNames(courses as Course[]), {
    staleTime: Infinity,
    enabled: !!courses,
  });
}
