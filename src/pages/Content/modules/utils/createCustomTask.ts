import postReq from './postReq';

/* Create a custom task item (Planner note). */
export default async function createCustomTask(
  title: string,
  date: string,
  course_id?: number
): Promise<void> {
  const data = {
    title: title,
    todo_date: date,
    course_id: course_id,
  };

  if (course_id) data.course_id = course_id;
  await postReq('/v1/planner_notes', JSON.stringify(data));
}
