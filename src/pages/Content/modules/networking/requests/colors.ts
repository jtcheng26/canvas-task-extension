import axios from 'axios';

/* Get user dashboard course colors */
export default function ColorsRequest() {
  return axios.get(
    `${location.protocol + '//' + location.hostname}/api/v1/users/self/colors`
  );
}
