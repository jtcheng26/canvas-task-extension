import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { THEME_COLOR } from '../constants';
import { DemoColors } from '../tests/demo';
import baseURL from '../utils/baseURL';
import isDemo from '../utils/isDemo';

async function getCourseColors(
  defaultColor?: string
): Promise<Record<string, string>> {
  if (isDemo()) return DemoColors;

  const { data } = await axios.get(`${baseURL()}/api/v1/users/self/colors`);

  /* course_xxxxxx from api, we only want xxxxxx */
  Object.keys(data.custom_colors).forEach((course_id) => {
    data.custom_colors[course_id.substring(7)] = data.custom_colors[course_id];
  });

  data.custom_colors['0'] = defaultColor || THEME_COLOR;

  return data.custom_colors;
}

/* Use cached course colors, lookup using course id */
export default function useCourseColors(
  defaultColor?: string
): UseQueryResult<Record<string, string>> {
  return useQuery('colors', () => getCourseColors(defaultColor), {
    staleTime: Infinity,
  });
}
