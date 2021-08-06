import axios from 'axios';
import { UserData } from '../types';
import { Course } from '../types';
import { ColorsRequest, CoursesRequest, PositionsRequest } from './requests';

/*
  Get course and user data from Canvas api
    Fetches intermediary 'User Data' (dashboard colors, dashboard positions, course names)
    along with course data and then processes it to return one course mapping
*/
export default async function getCourseUserData() {
  // Make requests in parallel
  const requests = await axios.all([
    ColorsRequest(),
    PositionsRequest(),
    CoursesRequest(),
  ]);
  const courseData: Course[] = requests[2].data.filter((course: Course) => {
    return !course.access_restricted_by_date;
  });
  const userData: UserData = {
    colors: requests[0].data.custom_colors,
    positions: requests[1].data.dashboard_positions,
    names: {},
  };
  courseData.forEach((course: Course) => {
    userData.names[course.id] = course.course_code as string;
  });
  return [courseData, userData];
}
