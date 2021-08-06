import axios from 'axios';

/* Get user dashboard course positions */
export default function PositionsRequest() {
  return axios.get(
    `${
      location.protocol + '//' + location.hostname
    }/api/v1/users/self/dashboard_positions`
  );
}
