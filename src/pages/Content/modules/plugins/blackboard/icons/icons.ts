import { IconSet } from '../../../types/config';
import { DEFAULT_ICON_SET } from '../../shared/icons';
import { AnnouncementIcon } from './announcement';
import { AssignmentIcon } from './assignment';
import { DiscussionIcon } from './discussion';
import { NoteIcon } from './note';

export const BLACKBOARD_ICON_SET: IconSet = {
  assignments: {
    ...DEFAULT_ICON_SET.assignments,
    announcement: AnnouncementIcon,
    assignment: AssignmentIcon,
    discussion_topic: DiscussionIcon,
    planner_note: NoteIcon,
  },
};
