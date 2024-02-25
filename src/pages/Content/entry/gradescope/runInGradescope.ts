import runGradescope from '../../modules/components/gradescope';
import { loadGradescopeState } from '../../modules/components/gradescope/utils/scrape';
import { getGradescopeIntegrationStatus } from '../../modules/components/gradescope/utils/store';

export async function GradescopeEntryPoint() {
  try {
    // make sure option is not globally disabled
    const enabled = await getGradescopeIntegrationStatus();
    if (!enabled) return;

    // update state
    const state = await loadGradescopeState();

    // only allow integration after Canvas is opened
    if (!Object.keys(state.GSCOPE_INT_canvas_courses).length) return;

    // will insert above this element
    const container = document.getElementById(
      'assignments-student-table_wrapper'
    )?.parentNode;

    // check if on course page
    if (!container || !container.parentNode) return;
    const path = window.location.pathname.split('/');
    const isCoursePage = path[path.length - 2] === 'courses';
    const currentPageCourseId = path.pop();
    if (!isCoursePage || !currentPageCourseId) return;

    // inject
    const root = document.createElement('div');
    container.parentNode?.insertBefore(root, container);

    runGradescope(root, state, currentPageCourseId);
  } catch (e) {
    console.error(e);
    return;
  }
}
