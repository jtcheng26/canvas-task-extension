import runApp from './modules/init';

const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    for (let addedNode of mutation.addedNodes) {
      if (
        'classList' in addedNode &&
        addedNode.classList.contains('Sidebar__TodoListContainer')
      )
        createSidebar(addedNode);
    }
  });
});

const containerList = document.getElementsByClassName(
  'Sidebar__TodoListContainer'
);
if (containerList.length > 0) createSidebar(containerList[0]);
else
  observer.observe(document.getElementById('right-side'), { childList: true });

function createSidebar(container) {
  observer.disconnect();
  chrome.storage.sync.get(
    ['startDate', 'period', 'startHour', 'startMinutes', 'sidebar'],
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
              ? true
              : result.sidebar,
        },
        function () {
          chrome.storage.sync.get(null, function (result2) {
            if (!result2.sidebar) {
              runApp(container, result2);
            } else {
              const newContainer = document.createElement('div');
              container.parentNode.insertBefore(newContainer, container);
              runApp(newContainer, result2);
            }
          });
        }
      );
    }
  );
}
