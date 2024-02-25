import {
  GradescopeCourse,
  GradescopeIntegrationState,
  GradescopeTask,
} from '../types';

export async function loadGradescopeState(): Promise<GradescopeIntegrationState> {
  const [courses, canvasCourses, syncedMap] = await Promise.all([
    getCourses(),
    getCanvasCourses(),
    getSyncedCourses(),
  ]);
  const enabledCourses = courses.filter((c) => c.gid in syncedMap);
  const taskMap = await updateCourseTasks(enabledCourses.map((c) => c.gid));
  return {
    GSCOPE_INT_canvas_courses: canvasCourses,
    GSCOPE_INT_course_id_map: syncedMap,
    tasks_map: taskMap,
    courses_map: enabledCourses.reduce((sum, course) => {
      return { ...sum, [course.gid]: course };
    }, {}),
  };
}

// scrape courses from gradescope dashboard
async function getCourses(): Promise<GradescopeCourse[]> {
  const page = await (await fetch('/')).text();
  // DOMParser is safe from XSS as long as nodes aren't injected into the window DOM
  const parser = new DOMParser();
  const doc = parser.parseFromString(page, 'text/html');
  const courseSection = doc.getElementsByClassName('courseList');
  if (!courseSection) return []; // not logged in
  const termSection = courseSection[0].getElementsByClassName(
    'courseList--coursesForTerm'
  );
  const courseNodes = termSection[0].getElementsByTagName('a');
  const courses = Array.from(courseNodes).map((c) => {
    const id = c.href.split('/').pop();
    const name = c.getElementsByClassName('courseBox--name')[0].textContent;
    const shortName = c.getElementsByClassName('courseBox--shortname')[0]
      .textContent;
    return {
      gid: id,
      name: name,
      course_code: shortName,
    } as GradescopeCourse;
  });
  return courses;
}

async function updateCourseTasks(
  courses: string[]
): Promise<Record<string, GradescopeTask[]>> {
  const res = await Promise.all(
    courses.map(async (gid) => {
      const tasks = await getCourseTasks(gid);
      if (tasks.length) setCourseTasks(gid, tasks);
      return { tasks, gid };
    })
  );
  return res.reduce((sum, curr) => {
    return { ...sum, [curr.gid]: curr.tasks };
  }, {});
}

async function getCourseTasks(gid: string): Promise<GradescopeTask[]> {
  const page = await (await fetch('/courses/' + gid)).text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(page, 'text/html');
  const table = doc.getElementById('assignments-student-table');
  const tbody = table?.getElementsByTagName('tbody');
  if (!tbody || !tbody.length) return [];
  const rows = tbody[0].getElementsByTagName('tr');
  return Array.from(rows)
    .map((r) => {
      const _button = r.getElementsByTagName('button')[0];
      let id: string | null, name: string | null;
      if (_button) {
        // unsubmitted/new
        id = _button.getAttribute('data-assignment-id');
        name = _button.textContent;
      } else {
        // already submitted/past
        const _a = r.getElementsByTagName('a')[0];
        if (!_a) {
          id = null;
          const _th = r.getElementsByTagName('th')[0];
          if (!_th) name = null;
          else name = name = _th.textContent;
        } else {
          id = _a.href.split('/')[6];
          name = _a.textContent;
        }
      }
      const status =
        r.getElementsByClassName('submissionStatus')[0].textContent;
      const dueNode = r.getElementsByClassName(
        'submissionTimeChart--dueDate'
      )[0];
      let due_date = dueNode ? dueNode.getAttribute('datetime') : '';
      if (due_date) due_date = new Date(due_date).toISOString();
      return {
        id: id || '',
        gid,
        name: name || '',
        status,
        due_date: due_date || null,
      } as GradescopeTask;
    })
    .filter((t) => !!t.name && !!t.status && !!t.due_date);
}

async function getCanvasCourses(): Promise<Record<string, string>> {
  const { GSCOPE_INT_canvas_courses } = await chrome.storage.sync.get(
    'GSCOPE_INT_canvas_courses'
  );
  return GSCOPE_INT_canvas_courses || {};
}

async function setCourseTasks(gid: string, tasks: GradescopeTask[]) {
  chrome.storage.sync.set({ [`GSCOPE_INT_tasks_${gid}`]: tasks });
}

async function setCourseMapping(gid: string, cid: string | null) {
  const { GSCOPE_INT_course_id_map } = await chrome.storage.sync.get(
    'GSCOPE_INT_course_id_map'
  );
  const newMap = { ...GSCOPE_INT_course_id_map, [gid]: cid };
  if (!cid) delete newMap[gid]; // cid is null
  chrome.storage.sync.set({ GSCOPE_INT_course_id_map: newMap });
}

export async function getSyncedCourses() {
  const { GSCOPE_INT_course_id_map } = await chrome.storage.sync.get(
    'GSCOPE_INT_course_id_map'
  );
  return GSCOPE_INT_course_id_map || {};
}

export async function syncCourse(gid: string, cid: string) {
  setCourseMapping(gid, cid);
  updateCourseTasks([gid]);
}

// in the future, think about unsyncing all assignments from old courses after a time period
export async function unsyncCourse(gid: string) {
  chrome.storage.sync.remove(`GSCOPE_INT_tasks_${gid}`);
  chrome.storage.sync.remove(`GSCOPE_INT_tasks_overrides_${gid}`);
  setCourseMapping(gid, null);
}
