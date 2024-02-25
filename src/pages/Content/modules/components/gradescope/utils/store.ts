import { Course } from '../../../types';

// for use by Tasks for Canvas
export async function storeCanvasCourses(courses: Course[]) {
  chrome.storage.sync.set({
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
}
