import runApp from './modules';
import './content.styles.css';
import { Options } from './modules/types';
import { OptionsDefaults } from './modules/constants';

function applyDefaults(options: Options): Options {
  return {
    ...OptionsDefaults,
    ...options,
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
  const storedUserOptions = Object.keys(OptionsDefaults);

  chrome.storage.sync.get(storedUserOptions, function (result) {
    chrome.storage.sync.set(applyDefaults(result as Options), function () {
      chrome.storage.sync.get(null, function (result2) {
        runAppUsingOptions(container, result2 as Options);
      });
    });
  });
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

/* This is the <aside> element contains the existing canvas sidebar. */
const rightSide = document.getElementById('right-side');

let sidebarLoaded = false;

function createSidebar(
  container: HTMLElement,
  observer?: MutationObserver
): void {
  observer?.disconnect();
  /* IMPORTANT: Only load sidebar once when switching between list view and other views */
  if (!sidebarLoaded) {
    sidebarLoaded = true;
    // // @ts-expect-error: InstallTrigger is a firefox global
    const isFirefox = false; // typeof InstallTrigger !== 'undefined'

    if (isFirefox) runAppInFirefox(container);
    else runAppInChrome(container);
  }
}

if (rightSide) {
  /*
  mutation observer waits for sidebar to load then injects content
  */
  const observer = new MutationObserver(() => {
    const todoListContainers = rightSide?.getElementsByClassName(
      'Sidebar__TodoListContainer'
    );
    const teacherTodoListContainers =
      rightSide?.getElementsByClassName('todo-list-header');
    if (todoListContainers?.length > 0)
      createSidebar(todoListContainers[0] as HTMLElement, observer);
    else if (teacherTodoListContainers?.length > 0)
      createSidebar(teacherTodoListContainers[0] as HTMLElement, observer);
  });

  /*
  in case the element is already loaded and not caught by mutation observer
*/
  const containerList = document.getElementsByClassName(
    'Sidebar__TodoListContainer'
  );
  const teacherContainerList =
    document.getElementsByClassName('todo-list-header');

  if (containerList.length > 0) createSidebar(containerList[0] as HTMLElement);
  else if (teacherContainerList.length > 0)
    createSidebar(teacherContainerList[0] as HTMLElement);
  else if (rightSide)
    observer.observe(rightSide as Node, {
      childList: true,
    });
}
/* This element is hidden in list view. */
const rightSideWrapper = document.getElementById('right-side-wrapper');

/* If the page loads list view before extension. */
function checkForListView() {
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

/* Observe changes to sidebar in case user switches to list view or extension loads before list view does. */
const listViewObserver = new MutationObserver(() => {
  checkForListView();
});

if (rightSideWrapper) {
  checkForListView();
  listViewObserver.observe(rightSideWrapper as Node, {
    attributes: true,
    attributeFilter: ['style'],
  });
}
