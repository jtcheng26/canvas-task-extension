import { FinalAssignment } from '../../../types';
import { groupByDateHeadings, groupByStatusHeadings } from './groupByHeadings';

export default function useHeadings(
  currentTab: 'Unfinished' | 'Completed',
  assignments: FinalAssignment[]
): Record<string, FinalAssignment[]> {
  return currentTab == 'Unfinished'
    ? groupByDateHeadings(assignments)
    : groupByStatusHeadings(assignments);
}
