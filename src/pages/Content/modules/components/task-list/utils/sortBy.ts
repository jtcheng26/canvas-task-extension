import { FinalAssignment } from '../../../types';

export function sortByGraded(
  assignments: FinalAssignment[]
): FinalAssignment[] {
  return assignments.sort((a, b) => (a.graded ? 1 : -1) - (b.graded ? 1 : -1));
}

/* Assumes assignments are sorted by due date by default, which should be true. */
export function sortByTab(
  currentTab: 'Unfinished' | 'Completed',
  assignments: FinalAssignment[]
): FinalAssignment[] {
  return currentTab === 'Completed' ? sortByGraded(assignments) : assignments;
}
