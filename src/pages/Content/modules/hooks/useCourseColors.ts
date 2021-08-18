import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { StringStringLookup } from '../types';
import baseURL from '../utils/baseURL';

async function getCourseColors(): Promise<StringStringLookup> {
  // console.log('Getting course colors');
  const { data } = await axios.get(`${baseURL()}/api/v1/users/self/colors`);

  Object.keys(data.custom_colors).forEach((course_id) => {
    data.custom_colors[course_id.substring(7)] = data.custom_colors[course_id];
  });

  return data.custom_colors;
}

/* Use cached course colors, lookup using course id */
export default function useCourseColors(): UseQueryResult<StringStringLookup> {
  return useQuery('colors', getCourseColors, { staleTime: Infinity });
}
