import {
  CanvasLMSEntrypoint,
  CanvasLMSConfig,
  InstallSettingsEntrypoint,
  isInstallSettings,
} from './modules/plugins/canvas';
import {
  isGradescope,
  GradescopeEntrypoint,
} from './modules/plugins/gradescope';
import {
  BlackboardEntrypoint,
  isBlackboard,
} from './modules/plugins/blackboard';

/* 

Performance overhead on websites that aren't Canvas:

document.getElementById() is called once

*/
if (CanvasLMSConfig.isActive) {
  /*
  mutation observer waits for sidebar to load then injects content
  */

  console.log('Tasks for Canvas: Canvas detected');

  CanvasLMSEntrypoint();

  /* 
  Allow user to modify critical settings directly on the install page
  */
  if (isInstallSettings) {
    InstallSettingsEntrypoint();
  }
} else if (isGradescope) {
  console.log('Tasks for Canvas: Gradescope detected');

  GradescopeEntrypoint();
} else if (isBlackboard) {
  console.log('Tasks for Canvas: Blackboard detected');

  BlackboardEntrypoint();
}
