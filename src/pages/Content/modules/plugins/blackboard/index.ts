import { LMSConfig } from '../../types/config';
import { makeMarkAssignment } from '../shared/customOverride';
import { makeCreateCustomTask } from '../shared/customTask';
import { makeUseAssignments } from '../shared/useAssignments';
import { makeUseCourses } from '../shared/useCourses';
import BlackboardEntrypoint from './entry';
import { BLACKBOARD_ICON_SET } from './icons/icons';
import loadBlackboardAssignments from './loaders/assignments';
import loadBlackboardCourses from './loaders/courses';
import dashCoursesBlackboard from './utils/dashCourses';

export const isBlackboard =
  (document.head.querySelector('meta[name="author"]') as HTMLMetaElement | null)
    ?.content === 'Blackboard';

export const BlackboardLMSConfig: LMSConfig = {
  isActive: isBlackboard,
  name: 'Demo',
  storageKey: 'blackboard_custom',
  useAssignments: makeUseAssignments(loadBlackboardAssignments),
  useCourses: makeUseCourses(loadBlackboardCourses),
  createAssignment: makeCreateCustomTask('blackboard_custom'), // todo
  markAssignment: makeMarkAssignment('blackboard_custom'),
  dashCourses: dashCoursesBlackboard,
  onCoursePage: () => false,
  iconSet: BLACKBOARD_ICON_SET,
};

export { BlackboardEntrypoint };
