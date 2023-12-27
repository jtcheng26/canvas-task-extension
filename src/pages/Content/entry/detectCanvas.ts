import { createSidebar } from './runInCanvas';

export const isCanvas = document
  .getElementById('application')
  ?.classList.contains('ic-app');

/* Load sidebar immediately or wait until page fully loads. */
function createSidebarWhenCanvasReady() {
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

/* Check if the page is in list view and observe when user changes to list view. */
function createSidebarWhenListview() {
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

export function CanvasEntryPoint(): void {
  createSidebarWhenCanvasReady();
  createSidebarWhenListview();
}
