import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { StringNumberLookup } from '../types/lookup';
import baseURL from '../utils/baseURL';

/* Get user dashboard course positions */
async function getCoursePositions(): Promise<StringNumberLookup> {
  // console.log('Getting course positions');
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
  StringNumberLookup
> {
  return useQuery('positions', getCoursePositions, { staleTime: Infinity });
}
