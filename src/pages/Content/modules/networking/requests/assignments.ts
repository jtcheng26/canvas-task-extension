import axios from 'axios';

/* Get assignments for a stringified list of up to 10 courses */
export default function AssignmentsRequest(
  start: string,
  end: string,
  courseList: string
) {
  return axios.get(
    `${
      location.protocol + '//' + location.hostname
    }/api/v1/calendar_events?type=assignment&start_date=${start}&end_date=${end}${courseList}&per_page=100&include=submission`
  );
}
