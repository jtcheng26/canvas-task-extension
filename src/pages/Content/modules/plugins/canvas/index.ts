import { loadCanvas } from './loaders/loadCanvas';
import { makeUseAssignments } from '../shared/useAssignments';
import { makeUseCourses } from '../shared/useCourses';
import { getCanvasCourses } from './loaders/loadCourses';
import dashCoursesCanvas from './utils/dashCourses';
import createCustomTaskCanvas from './utils/createCustomTask';
import { CanvasEntryPoint, isCanvas } from './detectCanvas';
import { LMSConfig } from '../../types/config';
import markAssignmentCanvas from './utils/markAssignment';
import onCoursePageCanvas from './utils/onCoursePage';
import { InstallSettingsEntryPoint, isInstallSettings } from './detectSettings';

const useCanvasAssignments = makeUseAssignments(loadCanvas);
const useCanvasCourses = makeUseCourses(getCanvasCourses);

export const CanvasLMSConfig: LMSConfig = {
  isActive: !!isCanvas,
  name: 'Canvas',
  useAssignments: useCanvasAssignments,
  useCourses: useCanvasCourses,
  dashCourses: dashCoursesCanvas,
  onCoursePage: onCoursePageCanvas,
  createAssignment: createCustomTaskCanvas,
  markAssignment: markAssignmentCanvas,
};

export const CanvasLMSEntrypoint = CanvasEntryPoint;

export const InstallSettingsEntrypoint = InstallSettingsEntryPoint;
export { isInstallSettings };
