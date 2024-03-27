import { LMSConfig } from '../../types/config';
import {
  useGradescopeAssignments,
  useGradescopeCourses,
} from './loaders/useAssignments';
import markGradescopeAssignment from './utils/markAssignment';
import { GradescopeEntrypoint } from './runInGradescope';

export const isGradescope = window.location.hostname === 'www.gradescope.com';

export const GradescopeLMSConfig: LMSConfig = {
  isActive: isGradescope,
  name: 'Demo',
  useAssignments: useGradescopeAssignments,
  useCourses: useGradescopeCourses,
  createAssignment: async () => null, // todo
  markAssignment: markGradescopeAssignment,
  dashCourses: () => undefined,
  onCoursePage: () => false,
};

export { GradescopeEntrypoint };
