import { AssignmentIcon, DiscussionIcon, QuizIcon } from '../icons';
import { AssignmentType } from '../types';

export const MAX_MARKED_ASSIGNMENTS = 1000;

export const ASSIGNMENT_ICON = {
  [AssignmentType.ASSIGNMENT]: AssignmentIcon,
  [AssignmentType.DISCUSSION]: DiscussionIcon,
  [AssignmentType.QUIZ]: QuizIcon,
  [AssignmentType.NOTE]: AssignmentIcon,
};
