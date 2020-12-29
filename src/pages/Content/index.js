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
  runApp(container);
}
