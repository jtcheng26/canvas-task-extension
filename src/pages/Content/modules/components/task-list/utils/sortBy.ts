import { FinalAssignment } from '../../../types';
import assignmentHasGrade from '../../../utils/assignmentHasGrade';
import assignmentIsDone from '../../../utils/assignmentIsDone';
import { TaskTypeTab } from './useHeadings';

function compareISODates(a: string, b: string): number {
  return new Date(a).valueOf() - new Date(b).valueOf();
}

/* Distinguish graded and ungraded assignments, then sort each group in reverse chronological order. */
export function sortByGraded(
  assignments: FinalAssignment[]
): FinalAssignment[] {
  return assignments.sort((a, b) => {
    const ag = assignmentHasGrade(a);
    const bg = assignmentHasGrade(b);
    if (ag === bg) return compareISODates(b.due_at, a.due_at); // new before old
    return (ag ? -1 : 1) - (bg ? -1 : 1); // graded before ungraded
  });
}

export function sortByRead(assignments: FinalAssignment[]): FinalAssignment[] {
  return assignments.sort((a, b) => {
    if (a.marked_complete == b.marked_complete)
      return compareISODates(b.due_at, a.due_at); // new before old
    return (a.marked_complete ? 1 : -1) - (b.marked_complete ? 1 : -1); // incomplete before complete
  });
}

export function sortByDate(assignments: FinalAssignment[]): FinalAssignment[] {
  return assignments.sort((a, b) => {
    // needs grading before not needs grading
    if (a.needs_grading_count && !b.needs_grading_count) return 1;
    else if (!a.needs_grading_count && b.needs_grading_count) return -1;
    return compareISODates(a.due_at, b.due_at); // old before new
  });
}

export function filterByTab(
  currentTab: TaskTypeTab,
  assignments: FinalAssignment[]
): FinalAssignment[] {
  if (currentTab === 'Announcements') return assignments;
  return assignments.filter((a) => {
    const done = assignmentIsDone(a);
    if (currentTab === 'NeedsGrading') return !done && a.needs_grading_count;
    if (currentTab === 'Unfinished') return !done && !a.needs_grading_count;
    return currentTab === 'Completed' ? done : !done;
  });
}

/* 
If on the completed tab, assignments are shown (new => old) (most recent submissions on top).
If on the unfinished tab, assignments are shown (old => new) (closest due date on top).
 */
export function sortByTab(
  currentTab: TaskTypeTab,
  assignments: FinalAssignment[]
): FinalAssignment[] {
  return currentTab === 'Completed'
    ? sortByGraded(assignments)
    : currentTab === 'Announcements'
    ? sortByRead(assignments)
    : sortByDate(assignments);
}
