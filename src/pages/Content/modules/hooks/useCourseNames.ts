import { useQuery, UseQueryResult } from 'react-query';
import { Course, StringStringLookup } from '../types';
import useCourses from './useCourses';

async function getCourseNames(courses: Course[]): Promise<StringStringLookup> {
  console.log('Getting course names');
  const names: StringStringLookup = {};
  courses.forEach((course: Course) => {
    names[course.id] = course.course_code as string;
  });
  return names;
}

export default function useCourseNames(): UseQueryResult {
  const { data: courses } = useCourses();
  return useQuery('names', () => getCourseNames(courses as Course[]), {
    staleTime: Infinity,
    enabled: !!courses,
  });
}
