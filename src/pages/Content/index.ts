import runApp from './modules';
import './content.styles.css';
import { Options } from './modules/types';

/*
  mutation observer waits for sidebar to load then injects content
*/
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((addedNode) => {
      const element = addedNode as HTMLElement;
      if (
        element.classList &&
        (element.classList.contains('Sidebar__TodoListContainer') ||
          element.classList.contains('todo-list-header'))
      )
        createSidebar(element);
    });
  });
});

/*
  in case the element is already there and not caught by mutation observer
*/
const containerList = document.getElementsByClassName(
  'Sidebar__TodoListContainer'
);
const teacherContainerList =
  document.getElementsByClassName('todo-list-header');
if (containerList.length > 0) createSidebar(containerList[0] as HTMLElement);
else if (teacherContainerList.length > 0)
  createSidebar(teacherContainerList[0] as HTMLElement);
else
  observer.observe(document.getElementById('right-side') as Node, {
    childList: true,
  });

function createSidebar(container: HTMLElement) {
  observer.disconnect();
  chrome.storage.sync.get(
    [
      'startDate',
      'period',
      'startHour',
      'startMinutes',
      'sidebar',
      'dash_courses',
    ],
    function (result) {
      chrome.storage.sync.set(
        {
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
        },
        function () {
          chrome.storage.sync.get(null, function (result2) {
            const data = result2 as Options;
            //console.log(result2);
            /*
              insert new div at top of sidebar to hold content
            */
            const newContainer = document.createElement('div');
            (container.parentNode as Node).insertBefore(
              newContainer,
              container
            );
            /*
              only visually hide sidebar to prevent issues with DOM modification
            */
            if (!result2.sidebar) {
              (
                document.getElementById('right-side') as HTMLElement
              ).className += 'hidden-sidebar';
            }
            runApp(newContainer, data);
          });
        }
      );
    }
  );
}
