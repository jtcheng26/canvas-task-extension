import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { Options } from './types';

/*
  render app function
*/

export default function runApp(container: HTMLElement, data: Options): void {
  ReactDOM.render(
    <React.StrictMode>
      <App options={data} />
    </React.StrictMode>,
    container
  );
  console.log(
    'Tasks for Canvas: Check out the repo! https://github.com/jtcheng26/canvas-task-extension'
  );
}
