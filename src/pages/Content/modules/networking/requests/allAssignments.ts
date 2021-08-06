import { Course } from '../../types';
import AssignmentsRequest from './assignments';

export default function AllAssignmentsRequest(
  start: string,
  end: string,
  courseData: Course[]
) {
  let page = 0;
  let requests = [];
  while (page * 10 < courseData.length) {
    let courseList = '';
    for (let i = 10 * page; i < 10 * page + 10 && i < courseData.length; i++) {
      courseList += `&context_codes[]=course_${courseData[i].id}`;
    }
    requests.push(AssignmentsRequest(start, end, courseList));
    page++;
  }
  return requests;
}
