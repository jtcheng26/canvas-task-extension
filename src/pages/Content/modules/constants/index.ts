import { AssignmentIcon, DiscussionIcon, NoteIcon, QuizIcon } from '../icons';
import { AssignmentType, FinalAssignment, Options } from '../types';
import JSONAssignmentDefaults from './defaults/assignmentDefaults.json';
import JSONOptionsDefaults from './defaults/optionsDefaults.json';

export const MAX_MARKED_ASSIGNMENTS = 400;

export const ASSIGNMENT_ICON: Record<AssignmentType, JSX.Element> = {
  [AssignmentType.ASSIGNMENT]: AssignmentIcon,
  [AssignmentType.DISCUSSION]: DiscussionIcon,
  [AssignmentType.QUIZ]: QuizIcon,
  [AssignmentType.NOTE]: NoteIcon,
  [AssignmentType.ANNOUNCEMENT]: AssignmentIcon,
  [AssignmentType.EVENT]: AssignmentIcon,
};

export const AssignmentDefaults = JSONAssignmentDefaults as FinalAssignment;
export const OptionsDefaults = JSONOptionsDefaults as Options;
