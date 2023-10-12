import { FinalAssignment } from '../../../types';
import { groupByDateHeadings, groupByStatusHeadings } from './groupByHeadings';

export type TaskTypeTab =
  | 'Unfinished'
  | 'Completed'
  | 'Announcements'
  | 'NeedsGrading';

export default function useHeadings(
  currentTab: TaskTypeTab,
  assignments: FinalAssignment[]
): Record<string, FinalAssignment[]> {
  return ['Unfinished', 'NeedsGrading'].includes(currentTab)
    ? groupByDateHeadings(assignments)
    : groupByStatusHeadings(assignments, currentTab);
}
