import runApp from './modules';
import './content.styles.css';
import { Options } from './modules/types';
import { getOptions } from './modules/hooks/useOptions';

/* 

Performance overhead on websites that aren't Canvas:

document.getElementById() is called once

*/
const isCanvas = document
  .getElementById('application')
  ?.classList.contains('ic-app');

/* Standardizes school-specific CSS class choices so the sidebar works/looks right. */
function prepareCanvasStyles() {
  /* Ensures that there is no max-width, so sidebar stays at right side on large screens. */
  document.body.classList.add('full-width');
}

function runAppUsingOptions(container: HTMLElement, data: Options) {
  /*
    insert new div at top of sidebar to hold content
  */
  const newContainer = document.createElement('div');
  newContainer.id = 'tfc-wall-rose';
  (container.parentNode as Node).insertBefore(newContainer, container);
  /*
    only visually hide sidebar to prevent issues with DOM modification
  */
  if (!data.sidebar) {
    (document.getElementById('right-side') as HTMLElement).className +=
      ' hidden-sidebar';
  }
  runApp(newContainer, data);
}

async function runAppInChrome(container: HTMLElement) {
  runAppUsingOptions(container, await getOptions());
}

/* Chrome APIs work fine in firefox currently, but firefox-native implementation is saved here for the future. */
function runAppInFirefox(container: HTMLElement) {
  // (async () => {
  //   // @ts-expect-error: InstallTrigger is only in Firefox
  //   const options = await browser.storage.sync.get(storedUserOptions);
  //   // @ts-expect-error: InstallTrigger is only in Firefox
  //   browser.storage.sync.set(optionsOrDefaults(options as Options));
  //   // @ts-expect-error: InstallTrigger is only in Firefox
  //   const updatedOptions = await browser.storage.sync.get(null);
  //   runAppUsingOptions(container, updatedOptions);
  // })();
  runAppInChrome(container);
}

let sidebarLoaded = false;

function createSidebar(
  container: HTMLElement,
  observer?: MutationObserver
): void {
  prepareCanvasStyles();
  observer?.disconnect();
  /* IMPORTANT: Only load sidebar once when switching between list view and other views */
  if (!sidebarLoaded) {
    sidebarLoaded = true;
    // // @ts-expect-error: InstallTrigger is a firefox global
    const isFirefox = false; // typeof InstallTrigger !== 'undefined'

    const outerWall = document.createElement('div');
    outerWall.id = 'tfc-wall-maria';
    container.parentElement?.insertBefore(outerWall, container);

    if (isFirefox) runAppInFirefox(outerWall);
    else runAppInChrome(outerWall);
  }
}

if (isCanvas) {
  /*
  mutation observer waits for sidebar to load then injects content
  */

  console.log('Tasks for Canvas: Canvas detected');

  /* This is the <aside> element contains the existing canvas sidebar. */
  const rightSide = document.getElementById('right-side');
  const path = window.location.pathname.split('/');
  const onCoursePage = path.length >= 2 && path[path.length - 2] === 'courses';

  if (rightSide) {
    // We can't insert directly in the right side element because of certain other extensions...
    // This might make it appear above the logo though, need someone to test that
    const observer = new MutationObserver(() => {
      const todoListContainers = rightSide?.getElementsByClassName(
        'Sidebar__TodoListContainer'
      );
      const teacherTodoListContainers =
        rightSide?.getElementsByClassName('todo-list-header');
      const comingUpContainers = rightSide?.getElementsByClassName('coming_up');
      if (
        onCoursePage ||
        todoListContainers?.length > 0 ||
        teacherTodoListContainers?.length > 0 ||
        comingUpContainers?.length > 0
      )
        createSidebar(rightSide);
    });

    /*
  in case the element is already loaded and not caught by mutation observer
*/
    const containerList = document.getElementsByClassName(
      'Sidebar__TodoListContainer'
    );
    const comingUpList = rightSide?.getElementsByClassName('coming_up');
    const teacherContainerList =
      document.getElementsByClassName('todo-list-header');

    if (
      onCoursePage ||
      containerList?.length > 0 ||
      teacherContainerList?.length > 0 ||
      comingUpList?.length > 0
    )
      createSidebar(rightSide);
    else if (rightSide) {
      observer.observe(rightSide as Node, {
        childList: true,
      });
    }
  }
}

/* If the page loads list view before extension. */
function checkForListView(
  rightSideWrapper: HTMLElement | null,
  rightSide: HTMLElement | null
) {
  /* Use this element to ensure this is list view and not another page or view. */
  const planner = document.getElementById('dashboard-planner-header');
  if (
    rightSide &&
    planner?.style.display !== 'none' &&
    rightSideWrapper?.style.display === 'none'
  ) {
    /* Make sidebar visible */
    rightSideWrapper.style.display = 'block';
    /* Fix sidebar while scrolling vertically */
    rightSideWrapper.style.position = 'sticky';
    rightSideWrapper.style.top = '0px';
    rightSideWrapper.style.overflowY = 'scroll';
    rightSideWrapper.style.height = '100vh';
    createSidebar(rightSide);
    return true;
  }
  return false;
}

/* Canvas check */
if (isCanvas) {
  /* This element is hidden in list view. */
  const rightSideWrapper = document.getElementById('right-side-wrapper');

  const rightSide = document.getElementById('right-side');

  /* Observe changes to sidebar in case user switches to list view or extension loads before list view does. */
  const listViewObserver = new MutationObserver(() => {
    checkForListView(rightSideWrapper, rightSide);
  });

  if (rightSideWrapper) {
    checkForListView(rightSideWrapper, rightSide);
    listViewObserver.observe(rightSideWrapper as Node, {
      attributes: true,
      attributeFilter: ['style'],
    });
  }
}
