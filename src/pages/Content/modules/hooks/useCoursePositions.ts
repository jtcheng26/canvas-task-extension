import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { DemoPositions } from '../tests/demo';
import baseURL from '../utils/baseURL';
import isDemo from '../utils/isDemo';

/* Get user dashboard course positions */
async function getCoursePositions(): Promise<Record<string, number>> {
  if (isDemo()) return DemoPositions;

  const { data } = await axios.get(
    `${baseURL()}/api/v1/users/self/dashboard_positions`
  );

  Object.keys(data.dashboard_positions).forEach((course_id) => {
    data.dashboard_positions[course_id.substring(7)] =
      data.dashboard_positions[course_id];
  });

  return data.dashboard_positions;
}

/* Use cached course positions, lookup using course id */
export default function useCoursePositions(): UseQueryResult<
  Record<string, number>
> {
  return useQuery('positions', getCoursePositions, { staleTime: Infinity });
}
