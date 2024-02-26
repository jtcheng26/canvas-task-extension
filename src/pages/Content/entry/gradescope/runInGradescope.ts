import runGradescope from '../../modules/components/gradescope';
import {
  loadSyncState,
  updateCourseTasks,
} from '../../modules/components/gradescope/utils/scrape';
import {
  getGradescopeIntegrationStatus,
  setGradescopeIntegrationStatus,
} from '../../modules/components/gradescope/utils/store';

export async function GradescopeEntryPoint() {
  try {
    // make sure option is not globally disabled
    const enabled = await getGradescopeIntegrationStatus();
    if (!enabled) {
      setGradescopeIntegrationStatus(false); // clear all
      return;
    }

    // don't do anything on a quiz page
    if (document.getElementsByClassName('js-submitAssignment').length) return;

    // get synced courses
    const state = await loadSyncState();
    const canvasCourses = Object.keys(state.GSCOPE_INT_canvas_courses);

    // only allow integration after Canvas is opened
    if (!canvasCourses.length) return;

    // scrape all tasks for sync-enabled courses
    const enabledCourses = Object.keys(state.GSCOPE_INT_course_id_map);
    updateCourseTasks(enabledCourses);

    // will insert at the end of this element's children
    const container = document.getElementsByClassName('courseHeader--top');

    // check if on course page
    if (!container.length) return;
    const path = window.location.pathname.split('/');
    const isCoursePage = path[path.length - 2] === 'courses';
    const currentPageCourseId = path.pop();
    if (!isCoursePage || !currentPageCourseId) return;

    // inject the sync option
    const root = document.createElement('div');
    container[0].appendChild(root);

    runGradescope(root, state, currentPageCourseId);
  } catch (e) {
    console.error(e);
    return;
  }
}
