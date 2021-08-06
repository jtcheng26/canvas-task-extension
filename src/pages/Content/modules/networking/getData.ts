import { Options, Course, UserData, Data } from '../types';
import getAssignmentData from './getAssignmentData';
import getCourseUserData from './getCourseUserData';

import { demoAssignments, demoCourses } from '../test/demo';

export default async function GetData(
  options: Options,
  startDate: Date,
  endDate: Date
): Promise<Data> {
  /*
    fetches everything
  */
  let data: Data = { assignments: demoAssignments, courses: demoCourses };
  try {
    const [courseData, userData] = await getCourseUserData();
    data = await getAssignmentData(
      courseData as Course[],
      userData as UserData,
      options,
      startDate,
      endDate
    );
  } catch (error) {
    console.error(error);
  }
  // data = { assignments: demoAssignments, courses: demoCourses };
  return data;
}
