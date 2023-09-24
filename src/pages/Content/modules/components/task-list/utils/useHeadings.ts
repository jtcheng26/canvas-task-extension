import { FinalAssignment } from '../../../types';
import { groupByDateHeadings, groupByStatusHeadings } from './groupByHeadings';

export type TaskTypeTab = 'Unfinished' | 'Completed' | 'Announcements';

export default function useHeadings(
  currentTab: TaskTypeTab,
  assignments: FinalAssignment[]
): Record<string, FinalAssignment[]> {
  return currentTab == 'Unfinished'
    ? groupByDateHeadings(assignments)
    : groupByStatusHeadings(assignments, currentTab);
}
