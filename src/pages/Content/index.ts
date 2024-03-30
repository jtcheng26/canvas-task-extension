import { CanvasEntryPoint, isCanvas } from './entry/detectCanvas';
import { isGradescope } from './entry/gradescope/detectGscope';
import { GradescopeEntryPoint } from './entry/gradescope/runInGradescope';
/* 

Performance overhead on websites that aren't Canvas:

document.getElementById() is called once

*/
if (isCanvas) {
  /*
  mutation observer waits for sidebar to load then injects content
  */

  console.log('Tasks for Canvas: Canvas detected');

  CanvasEntryPoint();
} else if (isGradescope) {
  console.log('Tasks for Canvas: Gradescope detected');

  GradescopeEntryPoint();
}
