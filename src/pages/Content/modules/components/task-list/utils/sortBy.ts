import { FinalAssignment } from '../../../types';

/* Distinguish graded and ungraded assignments, then sort each group in reverse chronological order. */
export function sortByGraded(
  assignments: FinalAssignment[]
): FinalAssignment[] {
  return assignments.sort((a, b) => {
    if (a.graded == b.graded)
      return new Date(b.due_at).valueOf() - new Date(a.due_at).valueOf();
    return (a.graded ? 1 : -1) - (b.graded ? 1 : -1);
  });
}

/* 
Assumes assignments are sorted by due date (old => new) by default.
If on the completed tab, assignments are shown (new => old) (most recent submissions on top).
 */
export function sortByTab(
  currentTab: 'Unfinished' | 'Completed',
  assignments: FinalAssignment[]
): FinalAssignment[] {
  return currentTab === 'Completed' ? sortByGraded(assignments) : assignments;
}
