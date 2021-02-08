import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

export default function runApp(container) {
  chrome.storage.sync.get(null, function (result) {
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
      },
      function () {
        chrome.storage.sync.get(null, function (data) {
          ReactDOM.render(
            <React.StrictMode>
              <App userOptions={data} />
            </React.StrictMode>,
            container
          );
        });
      }
    );
  });
  console.log(
    'Check out the repo! https://github.com/jtcheng26/canvas-task-extension'
  );
}
