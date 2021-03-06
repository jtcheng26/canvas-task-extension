import runApp from './modules/init';
import './content.styles.css';

/*
  mutation observer waits for sidebar to load then injects content
*/
const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    for (let addedNode of mutation.addedNodes) {
      if (
        'classList' in addedNode &&
        (addedNode.classList.contains('Sidebar__TodoListContainer') ||
          addedNode.classList.contains('todo-list-header'))
      )
        createSidebar(addedNode);
    }
  });
});

/*
  in case the element is already there and not caught by mutation observer
*/
const containerList = document.getElementsByClassName(
  'Sidebar__TodoListContainer'
);
const teacherContainerList = document.getElementsByClassName(
  'todo-list-header'
);
if (containerList.length > 0) createSidebar(containerList[0]);
else if (teacherContainerList.length > 0)
  createSidebar(teacherContainerList[0]);
else
  observer.observe(document.getElementById('right-side'), { childList: true });

function createSidebar(container) {
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
            //console.log(result2);
            /*
              insert new div at top of sidebar to hold content
            */
            const newContainer = document.createElement('div');
            container.parentNode.insertBefore(newContainer, container);
            /*
              only visually hide sidebar to prevent issues with DOM modification
            */
            if (!result2.sidebar) {
              document.getElementById('right-side').className +=
                'hidden-sidebar';
            }
            runApp(newContainer, result2);
          });
        }
      );
    }
  );
}
