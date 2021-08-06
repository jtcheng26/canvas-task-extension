import axios, { AxiosResponse } from 'axios';

/* Get user dashboard course positions */
export default function PositionsRequest(): Promise<AxiosResponse> {
  return axios.get(
    `${
      location.protocol + '//' + location.hostname
    }/api/v1/users/self/dashboard_positions`
  );
}
