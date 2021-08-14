import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { StringStringLookup } from '../types';

async function getCourseColors(): Promise<StringStringLookup> {
  console.log('Getting course colors');
  const { data } = await axios.get(
    `${location.protocol + '//' + location.hostname}/api/v1/users/self/colors`
  );

  return data.custom_colors;
}

/* Use cached course colors, lookup using course id */
export default function useCourseColors(): UseQueryResult<StringStringLookup> {
  return useQuery('colors', getCourseColors, { staleTime: Infinity });
}
