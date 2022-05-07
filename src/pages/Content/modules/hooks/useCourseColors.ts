import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { DemoColors } from '../tests/demo';
import { StringStringLookup } from '../types';
import baseURL from '../utils/baseURL';

async function getCourseColors(): Promise<StringStringLookup> {
  if (process.env.DEMO) return DemoColors;

  const { data } = await axios.get(`${baseURL()}/api/v1/users/self/colors`);

  /* course_xxxxxx from api, we only want xxxxxx */
  Object.keys(data.custom_colors).forEach((course_id) => {
    data.custom_colors[course_id.substring(7)] = data.custom_colors[course_id];
  });

  return data.custom_colors;
}

/* Use cached course colors, lookup using course id */
export default function useCourseColors(): UseQueryResult<StringStringLookup> {
  return useQuery('colors', getCourseColors, { staleTime: Infinity });
}
