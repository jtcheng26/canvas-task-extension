import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { Course } from '../types';

/* Get all courses (200 limit for now, will change to paginate in the future) */
async function getCourses(): Promise<Course[]> {
  console.log('Getting courses');
  const { data } = await axios.get(
    `${
      location.protocol + '//' + location.hostname
    }/api/v1/courses?per_page=200`
  );

  return data.filter((course: Course) => {
    return !course.access_restricted_by_date;
  });
}

/* Use cached course data */
export default function useCourses(): UseQueryResult<Course[]> {
  return useQuery('courses', getCourses, { staleTime: Infinity });
}
