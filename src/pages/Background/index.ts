chrome.runtime.onInstalled.addListener(function (object) {
  const externalUrl = 'https://www.tasksforcanvas.info/getting-started';

  if (object.reason === 'install') {
    chrome.tabs.create({ url: externalUrl });
  }
});

chrome.runtime.setUninstallURL('https://www.tasksforcanvas.info/uninstall');
