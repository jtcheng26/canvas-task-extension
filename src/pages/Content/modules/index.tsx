import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { Options } from './types';
import { LMSConfig } from './types/config';

/*
  render app function
*/

export default function runApp(
  container: HTMLElement,
  lms: LMSConfig,
  data: Options
): void {
  ReactDOM.render(
    <React.StrictMode>
      <App lms={lms} options={data} />
    </React.StrictMode>,
    container
  );
  console.log(
    'Tasks for Canvas: Check out the repo! https://github.com/jtcheng26/canvas-task-extension'
  );
}
