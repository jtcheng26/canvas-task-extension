import React from 'react';
import ReactDOM from 'react-dom';
import GradescopeIntegration from './GradescopeIntegration';
import { GradescopeIntegrationState } from './types';

/*
  render app function
*/

export default function runGradescope(
  container: HTMLElement,
  data: GradescopeIntegrationState,
  course: string,
  courseName: string,
  promo: boolean
): void {
  ReactDOM.render(
    <React.StrictMode>
      <GradescopeIntegration
        course={course}
        courseName={courseName}
        data={data}
        promo={promo}
      />
    </React.StrictMode>,
    container
  );
  console.log(
    'Tasks for Canvas: Check out the repo! https://github.com/jtcheng26/canvas-task-extension'
  );
}
