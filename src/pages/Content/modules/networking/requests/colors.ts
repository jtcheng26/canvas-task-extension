import axios, { AxiosResponse } from 'axios';

/* Get user dashboard course colors */
export default function ColorsRequest(): Promise<AxiosResponse> {
  return axios.get(
    `${location.protocol + '//' + location.hostname}/api/v1/users/self/colors`
  );
}
