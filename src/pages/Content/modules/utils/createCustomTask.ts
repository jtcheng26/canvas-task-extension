import { PlannerAssignment } from '../types';
import apiReq from './apiReq';

/* Create a custom task item (Planner note). */
export default async function createCustomTask(
  title: string,
  date: string,
  course_id?: string,
  grading = false,
  link?: string
): Promise<PlannerAssignment | null> {
  return new Promise((resolve) => {
    const data: Record<string, string> = {
      title: title,
      todo_date: date,
      details:
        'Created using Tasks for Canvas\n' +
        (grading ? 'Instructor Note\n' : 'Custom Task\n'),
    };

    /* details will be:
         2 lines if no link or course
         3 lines if link but no course
         4 lines course (3rd is empty if no link)
         So link will always be 3rd line and course 4th
    */
    if (link) data['details'] += link;
    if (course_id && course_id !== '0') {
      if (!grading) data['course_id'] = course_id;
      // course_id doesn't work in planner notes for teachers, so I add it to details and parse when loading
      else data['details'] += '\n' + course_id;
    }
    apiReq('/v1/planner_notes', JSON.stringify(data), 'post')
      .then((res) => {
        resolve(res?.data as PlannerAssignment);
      })
      .catch((err) => {
        console.error(err);
        resolve(null);
      });
  });
}
