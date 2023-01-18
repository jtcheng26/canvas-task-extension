import { PlannerAssignment } from '../types';
import apiReq from './apiReq';

/* Create a custom task item (Planner note). */
export default async function createCustomTask(
  title: string,
  date: string,
  course_id?: string
): Promise<PlannerAssignment | null> {
  return new Promise((resolve) => {
    const data: Record<string, string> = {
      title: title,
      todo_date: date,
    };

    if (course_id && course_id !== '0') data['course_id'] = course_id;
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
