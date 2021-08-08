import axios, { AxiosResponse } from 'axios';

/* Get all courses (200 limit for now, will change to paginate in the future) */
export default function CoursesRequest(): Promise<AxiosResponse> {
  return axios.get(
    `${
      location.protocol + '//' + location.hostname
    }/api/v1/courses?per_page=200`
  );
}
