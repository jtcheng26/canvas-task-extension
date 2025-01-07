import { AssignmentType } from '../../types';
import { IconSet } from '../../types/config';
import {
  AssignmentIcon,
  DiscussionIcon,
  QuizIcon,
  NoteIcon,
  AnnouncementIcon,
  GradescopeIcon,
  NeedsGradingIcon,
} from '../../icons';
export const DEFAULT_ICON_SET: IconSet = {
  assignments: {
    [AssignmentType.ASSIGNMENT]: AssignmentIcon,
    [AssignmentType.DISCUSSION]: DiscussionIcon,
    [AssignmentType.QUIZ]: QuizIcon,
    [AssignmentType.NOTE]: NoteIcon,
    [AssignmentType.ANNOUNCEMENT]: AnnouncementIcon,
    [AssignmentType.EVENT]: AssignmentIcon,
    [AssignmentType.GRADESCOPE]: GradescopeIcon,
    ungraded: NeedsGradingIcon,
  },
};
