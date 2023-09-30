import { useQuery, UseQueryResult } from 'react-query';
import { DemoNames } from '../tests/demo';
import { Course } from '../types';
import isDemo from '../utils/isDemo';
import useCourses from './useCourses';
import axios from 'axios';

interface CourseNickname {
  course_id: string;
  name: string;
  nickname: string;
}

/* In case we want to use user-chosen names in the future, which would require another api request. */
async function getCourseNames(
  courses: Course[]
): Promise<Record<string, string>> {
  if (isDemo()) return DemoNames;

  const nicknames = (await axios.get('/api/v1/users/self/course_nicknames'))
    .data as CourseNickname[];

  const names: Record<string, string> = {};
  courses.forEach((course: Course) => {
    names[course.id] = course.course_code as string;
  });

  nicknames.forEach((course) => {
    names[course.course_id] = course.nickname;
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
