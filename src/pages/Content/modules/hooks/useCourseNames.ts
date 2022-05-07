import { useQuery, UseQueryResult } from 'react-query';
import { DemoNames } from '../tests/demo';
import { Course, StringStringLookup } from '../types';
import useCourses from './useCourses';

/* In case we want to use user-chosen names in the future, which would require another api request. */
async function getCourseNames(courses: Course[]): Promise<StringStringLookup> {
  if (process.env.DEMO) return DemoNames;

  const names: StringStringLookup = {};
  courses.forEach((course: Course) => {
    names[course.id] = course.course_code as string;
  });
  return names;
}

export default function useCourseNames(): UseQueryResult<StringStringLookup> {
  const { data: courses } = useCourses();
  return useQuery('names', () => getCourseNames(courses as Course[]), {
    staleTime: Infinity,
    enabled: !!courses,
  });
}
