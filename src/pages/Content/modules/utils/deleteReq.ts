import axios, { AxiosResponse } from 'axios';
import baseURL from './baseURL';

/* Send a post request w/ CSRF Token. */
export default async function deleteReq(
  path: string,
  body: string
): Promise<AxiosResponse> {
  const CSRFtoken = function () {
    return decodeURIComponent(
      (document.cookie.match('(^|;) *_csrf_token=([^;]*)') || '')[2]
    );
  };
  const url = `${baseURL()}/api${path}`;
  const headers = {
    data: JSON.parse(body),
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': CSRFtoken(),
    },
  };
  // Try the specified method first, flip to the other if error occurs.
  return await axios.delete(url, headers);
}
