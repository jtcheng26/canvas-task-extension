import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { Options } from './types';

/*
  render app function
*/

export default function runApp(container: HTMLElement, options: Options): void {
  ReactDOM.render(
    <React.StrictMode>
      <App options={options} />
    </React.StrictMode>,
    container
  );
  console.log(
    'Check out the repo! https://github.com/jtcheng26/canvas-task-extension'
  );
}
