import axios, { AxiosResponse } from 'axios';
import baseURL from './baseURL';

/* Send a post request w/ CSRF Token. */
export default async function postReq(
  path: string,
  body: string,
  put = false,
  id?: string
): Promise<AxiosResponse> {
  const CSRFtoken = function () {
    return decodeURIComponent(
      (document.cookie.match('(^|;) *_csrf_token=([^;]*)') || '')[2]
    );
  };
  const url = `${baseURL()}/api${path}`;
  const headers = {
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': CSRFtoken(),
    },
  };
  // Try the specified method first, flip to the other if error occurs.
  if (put) {
    return await axios.put(url + '/' + id, body, headers);
  } else {
    return await axios.post(url, body, headers);
  }
}
