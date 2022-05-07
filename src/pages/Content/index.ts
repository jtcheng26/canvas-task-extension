import runApp from './modules';
import './content.styles.css';
import { Options } from './modules/types';

/* Actual app container */
const rightSide = document.getElementById('right-side');

let sidebarLoaded = false;

const storedUserOptions = [
  'complete_assignments',
  'startDate',
  'period',
  'startHour',
  'startMinutes',
  'sidebar',
  'dash_courses',
  'due_date_headings',
  'show_locked_assignments',
];

function optionsOrDefaults(result: Options): Options {
  return {
    complete_assignments: !result.complete_assignments
      ? []
      : result.complete_assignments,
    startDate: !result.startDate ? 1 : result.startDate,
    startHour: !result.startHour ? 15 : result.startHour,
    startMinutes: !result.startMinutes ? 0 : result.startMinutes,
    period: !(
      result.period === 'Day' ||
      result.period === 'Week' ||
      result.period === 'Month'
    )
      ? 'Week'
      : result.period,
    sidebar:
      result.sidebar !== false && result.sidebar !== true
        ? false
        : result.sidebar,
    dash_courses:
      result.dash_courses !== false && result.dash_courses !== true
        ? false
        : result.dash_courses,
    due_date_headings:
      result.due_date_headings !== false && result.due_date_headings !== true
        ? true
        : result.due_date_headings,
    show_locked_assignments:
      result.show_locked_assignments !== false &&
      result.show_locked_assignments !== true
        ? true
        : result.show_locked_assignments,
  };
}

function runAppUsingOptions(container: HTMLElement, data: Options) {
  /*
    insert new div at top of sidebar to hold content
  */
  const newContainer = document.createElement('div');
  (container.parentNode as Node).insertBefore(newContainer, container);
  /*
    only visually hide sidebar to prevent issues with DOM modification
  */
  if (!data.sidebar) {
    (document.getElementById('right-side') as HTMLElement).className +=
      'hidden-sidebar';
  }
  runApp(newContainer, data);
}

function runAppInChrome(container: HTMLElement) {
  chrome.storage.sync.get(storedUserOptions, function (result) {
    chrome.storage.sync.set(optionsOrDefaults(result as Options), function () {
      chrome.storage.sync.get(null, function (result2) {
        runAppUsingOptions(container, result2 as Options);
      });
    });
  });
}

/* Chrome APIs work fine in firefox currently, but firefox-native implementation is commented here for the future. */
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

function createSidebar(
  container: HTMLElement,
  observer?: MutationObserver
): void {
  observer?.disconnect();
  /* IMPORTANT: Only load sidebar once when switching between list view and other views */
  if (!sidebarLoaded) {
    sidebarLoaded = true;
    // // @ts-expect-error: InstallTrigger is only in Firefox
    const isFirefox = false; // typeof InstallTrigger !== 'undefined'

    if (isFirefox) runAppInFirefox(container);
    else runAppInChrome(container);
  }
}

if (rightSide) {
  /*
  in case the element is already there and not caught by mutation observer
*/
  const containerList = document.getElementsByClassName(
    'Sidebar__TodoListContainer'
  );
  const teacherContainerList =
    document.getElementsByClassName('todo-list-header');
  /*
  mutation observer waits for sidebar to load then injects content
  */
  const observer = new MutationObserver(() => {
    const todoListContainers = rightSide?.getElementsByClassName(
      'Sidebar__TodoListContainer'
    );
    const teacherTodoListContainers =
      rightSide?.getElementsByClassName('todo-list-header');
    if (todoListContainers?.length)
      createSidebar(todoListContainers[0] as HTMLElement, observer);
    else if (teacherTodoListContainers?.length)
      createSidebar(teacherTodoListContainers[0] as HTMLElement, observer);
  });

  if (containerList.length > 0) createSidebar(containerList[0] as HTMLElement);
  else if (teacherContainerList.length > 0)
    createSidebar(teacherContainerList[0] as HTMLElement);
  else if (rightSide)
    observer.observe(rightSide as Node, {
      childList: true,
    });
}
/* Make sidebar visible in list view */
const rightSideWrapper = document.getElementById('right-side-wrapper');
/* Ensure this is list view and not another page or view */
const planner = document.getElementById('dashboard-planner-header');

/* Page loads list view before extension */
function checkForListView() {
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

checkForListView();

/* Observe changes to sidebar in case user switches to list view or extension loads before list view does */
const listViewObserver = new MutationObserver(() => {
  checkForListView();
});
if (rightSideWrapper) {
  listViewObserver.observe(rightSideWrapper as Node, {
    attributes: true,
    attributeFilter: ['style'],
  });
}
