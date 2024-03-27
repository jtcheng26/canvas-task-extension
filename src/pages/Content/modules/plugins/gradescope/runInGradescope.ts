import migrateGradescopeToLocal from '../../../modules/components/gradescope/utils/migrate';
import runApp from '../..';
import runGradescope from '../../components/gradescope';
import {
  loadSyncState,
  updateCourseTasks,
} from '../../components/gradescope/utils/scrape';
import {
  getGradescopeIntegrationStatus,
  setGradescopeIntegrationStatus,
  shouldShowOnetimePromo,
} from '../../components/gradescope/utils/store';
import { getOptions } from '../../hooks/useOptions';
import { GradescopeLMSConfig } from '.';

export async function GradescopeEntrypoint() {
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

    runTasksInGradescope();

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

function prepareGradescopeTasksStyles() {
  const mainPage = document.querySelector('.l-mainWrapper') as HTMLElement;
  const sidebarWidthElems = document.querySelectorAll(
    '.l-sidebar, .sidebar--userProfile'
  );
  const sidebarScrollview = document.querySelector(
    '.sidebar--content'
  ) as HTMLElement;
  const sidebarBorder = document.querySelector('.sidebar--userProfileBorder');
  const toggleButton = document.querySelector('.js-toggleSidebar');
  const introText = document.querySelector('.sidebar--introText');
  const assignmentTable = document.getElementById('assignments-student-table');
  (sidebarScrollview as HTMLElement).style.transition = 'none';
  mainPage?.classList.add('tfc-gradescope-main');
  sidebarWidthElems.forEach((e) => e.classList.add('tfc-gradescope-sidebar'));
  toggleButton?.classList.add('tfc-gradescope-toggle');
  introText?.classList.add('tfc-gradescope-text');
  sidebarBorder?.classList.add('tfc-gradescope-border');
  sidebarScrollview?.classList.add('tfc-gradescope-scroll');
  if (assignmentTable) assignmentTable.style.width = 'calc(100vw - 360px)';
  return () => {
    toggleButton?.classList.remove('tfc-gradescope-toggle');
    mainPage?.classList.remove('tfc-gradescope-main');
    sidebarWidthElems.forEach((e) =>
      e.classList.remove('tfc-gradescope-sidebar')
    );
    introText?.classList.remove('tfc-gradescope-text');
    sidebarBorder?.classList.remove('tfc-gradescope-border');
    sidebarScrollview?.classList.remove('tfc-gradescope-scroll');
  };
}

export async function runTasksInGradescope() {
  const container = document.getElementsByClassName('sidebar--content')[0];
  if (!container || !container.parentElement) return;
  const root = document.createElement('div');
  root.style.lineHeight = 'normal';
  root.style.width = '240px';
  container.appendChild(root);

  let removeStyles = prepareGradescopeTasksStyles();

  Array.from(document.getElementsByClassName('js-toggleSidebar')).forEach(
    (e) => {
      e.addEventListener('click', () => {
        if (root.style.display !== 'none') {
          root.style.display = 'none';
          removeStyles();
        } else {
          root.style.display = 'block';
          removeStyles = prepareGradescopeTasksStyles();
        }
      });
    }
  );

  prepareGradescopeTasksStyles();

  runApp(root, GradescopeLMSConfig, await getOptions());
}
