import axios from 'axios';
import baseURL from './baseURL';

/* Send a post request w/ CSRF Token. */
export default async function postReq(
  path: string,
  body: string
): Promise<void> {
  const CSRFtoken = function () {
    return decodeURIComponent(
      (document.cookie.match('(^|;) *_csrf_token=([^;]*)') || '')[2]
    );
  };
  await axios.post(`${baseURL()}/api${path}`, body, {
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': CSRFtoken(),
    },
  });
}
