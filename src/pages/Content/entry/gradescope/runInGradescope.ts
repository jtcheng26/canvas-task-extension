import runGradescope from '../../modules/components/gradescope';
import migrateGradescopeToLocal from '../../modules/components/gradescope/utils/migrate';
import {
  loadSyncState,
  updateCourseTasks,
} from '../../modules/components/gradescope/utils/scrape';
import {
  getGradescopeIntegrationStatus,
  setGradescopeIntegrationStatus,
  shouldShowOnetimePromo,
} from '../../modules/components/gradescope/utils/store';

export async function GradescopeEntryPoint() {
  try {
    // make sure option is not globally disabled
    const enabled = await getGradescopeIntegrationStatus();
    if (!enabled) {
      setGradescopeIntegrationStatus(false); // clear all
      return;
    }

    await migrateGradescopeToLocal();

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
    const courseName =
      document.getElementsByClassName('courseHeader--title')[0].textContent ||
      '';

    // introduce this feature to users for the first time
    if (
      (await shouldShowOnetimePromo(currentPageCourseId)) &&
      !(currentPageCourseId in state.GSCOPE_INT_course_id_map)
    ) {
      const root = document.createElement('div');
      const container = document.getElementById(
        'assignments-student-table_wrapper'
      )?.parentNode;
      if (container) {
        container.insertBefore(root, container.children[0]);
        runGradescope(root, state, currentPageCourseId, courseName, true);
      }
    }

    // inject the sync option
    const root = document.createElement('div');
    container[0].appendChild(root);

    runGradescope(root, state, currentPageCourseId, courseName, false);
  } catch (e) {
    console.error(e);
    return;
  }
}
