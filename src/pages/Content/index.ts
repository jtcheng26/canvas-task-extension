import { CanvasEntryPoint, isCanvas } from './entry/detectCanvas';
import {
  InstallSettingsEntryPoint,
  isInstallSettings,
} from './entry/detectSettings';
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

  /* 
  Allow user to modify critical settings directly on the install page
  */
  if (isInstallSettings) {
    InstallSettingsEntryPoint();
  }
}
