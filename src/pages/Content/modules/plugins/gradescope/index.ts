import { LMSConfig } from '../../types/config';
import {
  useGradescopeAssignments,
  useGradescopeCourses,
} from './loaders/useAssignments';
import markGradescopeAssignment from './utils/markAssignment';
import { GradescopeEntrypoint } from './runInGradescope';
import { makeCreateCustomTask } from '../shared/customTask';
import { DEFAULT_ICON_SET } from '../shared/icons';

export const isGradescope = window.location.hostname === 'www.gradescope.com';

export const GradescopeLMSConfig: LMSConfig = {
  isActive: isGradescope,
  name: 'Demo',
  storageKey: 'gradescope_custom',
  useAssignments: useGradescopeAssignments,
  useCourses: useGradescopeCourses,
  createAssignment: makeCreateCustomTask('gradescope_custom'), // todo
  markAssignment: markGradescopeAssignment,
  dashCourses: () => undefined,
  onCoursePage: () => false,
  iconSet: DEFAULT_ICON_SET,
};

export { GradescopeEntrypoint };
