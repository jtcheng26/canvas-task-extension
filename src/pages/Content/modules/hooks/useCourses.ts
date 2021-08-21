import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { DemoCourses } from '../tests/demo';
import { Course } from '../types';
import baseURL from '../utils/baseURL';

/* Get all courses (200 limit for now, will change to paginate in the future) */
async function getCourses(): Promise<Course[]> {
  if (process.env.DEMO) return DemoCourses;

  const { data } = await axios.get(`${baseURL()}/api/v1/courses?per_page=200`);

  return data.filter((course: Course) => {
    return !course.access_restricted_by_date;
  });
}

/* Use cached course data */
export default function useCourses(): UseQueryResult<Course[]> {
  return useQuery('courses', getCourses, { staleTime: Infinity });
}
