import { LMSConfig } from '../../types/config';
import {
  useGradescopeAssignments,
  useGradescopeCourses,
} from './loaders/useAssignments';
import markGradescopeAssignment from './utils/markAssignment';
import { GradescopeEntrypoint } from './runInGradescope';
import { makeCreateCustomTask } from '../shared/customTask';

export const isGradescope = window.location.hostname === 'www.gradescope.com';

export const GradescopeLMSConfig: LMSConfig = {
  isActive: isGradescope,
  name: 'Demo',
  useAssignments: useGradescopeAssignments,
  useCourses: useGradescopeCourses,
  createAssignment: makeCreateCustomTask('gradescope_custom'), // todo
  markAssignment: markGradescopeAssignment,
  dashCourses: () => undefined,
  onCoursePage: () => false,
};

export { GradescopeEntrypoint };
