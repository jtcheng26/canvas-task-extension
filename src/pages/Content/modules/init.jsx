import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

export default function runApp(container, data) {
  ReactDOM.render(
    <React.StrictMode>
      <App userOptions={data} />
    </React.StrictMode>,
    container
  );
  console.log(
    'Check out the repo! https://github.com/jtcheng26/canvas-task-extension'
  );
}
