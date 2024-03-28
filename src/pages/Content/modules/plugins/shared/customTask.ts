import { AssignmentType, FinalAssignment } from '../../types';

type StoredCustomTask = {
  name: string;
  due_at: string;
  course_id?: string;
  html_url?: string;
  grading?: boolean; // for future implementation
};

function parseStoredCustomTask(
  id: string,
  task: StoredCustomTask
): FinalAssignment {
  return {
    name: task.name,
    due_at: task.due_at,
    course_id: task.course_id || '0',
    html_url: task.html_url || '/',
    points_possible: 0,
    id: id,
    plannable_id: id,
    submitted: false,
    graded: false,
    graded_at: '',
    score: 0,
    type: AssignmentType.NOTE,
    marked_complete: false,
  };
}

export async function loadCustomTasks(
  platformKey: string
): Promise<FinalAssignment[]> {
  const key = `${platformKey}_task`;
  const tasks = await chrome.storage.local.get(key);
  if (!(key in tasks)) return [];
  return Object.keys(tasks[key] as Record<string, StoredCustomTask>).map((id) =>
    parseStoredCustomTask(id, tasks[key][id])
  );
}

export async function deleteCustomTask(platformKey: string, id: string) {
  const key = `${platformKey}_task`;
  const tasks = await chrome.storage.local.get(key);
  if (id in tasks[key]) delete tasks[key][id];
  chrome.storage.local.set({ [key]: tasks[key] });
}

/* Create a custom task item (Planner note). */
export async function createCustomTask(
  platformKey: string,
  title: string,
  date: string,
  course_id?: string,
  grading = false,
  link?: string
): Promise<FinalAssignment | null> {
  const id = crypto.randomUUID();
  const res: StoredCustomTask = {
    name: title,
    due_at: date,
  };
  if (course_id) res.course_id = course_id;
  if (link) res.html_url = link;
  if (grading) res.grading = grading;
  const key = `${platformKey}_task`;
  const tasks = await chrome.storage.local.get(key);
  chrome.storage.local.set({ [key]: { ...tasks[key], [id]: res } });
  return parseStoredCustomTask(id, res);
}

export const makeCreateCustomTask =
  (platformKey: string) =>
  (
    title: string,
    date: string,
    course_id?: string,
    grading?: boolean,
    link?: string
  ) =>
    createCustomTask(platformKey, title, date, course_id, grading, link);
