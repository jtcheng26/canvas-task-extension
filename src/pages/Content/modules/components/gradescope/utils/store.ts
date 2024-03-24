import { Course } from '../../../types';
import { AssignmentStatus } from '../../../types/assignment';
import { GradescopeOverride, GradescopeTask } from '../types';
import { getSyncedCourses, unsyncCourse } from './scrape';

// for use by Tasks for Canvas
export async function storeCanvasCourses(courses: Course[]) {
  chrome.storage.local.set({
    GSCOPE_INT_canvas_courses: courses.reduce((sum, c) => {
      return { ...sum, [c.id]: c.name };
    }, {}),
  });
}

// return true if enabled
export async function getGradescopeIntegrationStatus() {
  return !(await chrome.storage.sync.get({ GSCOPE_INT_disabled: false }))
    .GSCOPE_INT_disabled;
}

export async function setGradescopeIntegrationStatus(active: boolean) {
  chrome.storage.sync.set({ GSCOPE_INT_disabled: !active });
  if (!active) clearAllGradescope();
}

async function clearAllGradescope() {
  const synced = await getSyncedCourses();
  await Promise.all(Object.keys(synced).map(unsyncCourse));
  chrome.storage.sync.remove([
    'GSCOPE_INT_course_id_map',
    'GSCOPE_INT_promo',
    'GSCOPE_INT_last_sync',
  ]);
}

export async function getCourseTasks(gid: string): Promise<GradescopeTask[]> {
  const key = `GSCOPE_INT_tasks_${gid}`;
  const res = await chrome.storage.local.get(key);
  if (!(key in res)) return [];
  return res[key] || [];
}

// ID isn't always present, so keep as many identifiers as possible
export async function setGradescopeOverride(
  id: string,
  gid: string,
  name: string,
  due_date: string,
  status:
    | AssignmentStatus.COMPLETE
    | AssignmentStatus.DELETED
    | AssignmentStatus.UNFINISHED
) {
  const key = `GSCOPE_INT_tasks_overrides_${gid}`;
  const overrides = (await chrome.storage.local.get(key))[key] || [];
  const newOverrides = overrides.filter(
    (o: GradescopeOverride) =>
      o.id !== id || o.gid !== gid || o.name !== name || o.due_date !== due_date
  );
  newOverrides.push({
    id,
    gid,
    name,
    due_date,
    status: status,
  });
  chrome.storage.local.set({ [key]: newOverrides });

  return newOverrides;
}

export async function getGradescopeOverrides(
  gid: string
): Promise<GradescopeOverride[]> {
  const key = `GSCOPE_INT_tasks_overrides_${gid}`;
  const res = await chrome.storage.local.get(key);
  if (!(key in res)) return [];
  return res[key] || [];
}

export async function shouldShowOnetimePromo(gid: string) {
  const seenPromo =
    (await chrome.storage.sync.get('GSCOPE_INT_promo'))['GSCOPE_INT_promo'] ||
    [];
  return !seenPromo.includes(gid);
}

export async function viewPromo(gid: string) {
  const seenPromo =
    (await chrome.storage.sync.get(`GSCOPE_INT_promo`))['GSCOPE_INT_promo'] ||
    [];
  chrome.storage.sync.set({ GSCOPE_INT_promo: seenPromo.concat([gid]) });
}
