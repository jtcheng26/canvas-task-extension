import { FinalAssignment } from '../../../types';
import assignmentHasGrade from '../../../utils/assignmentHasGrade';
import getDaysLeft from './getDaysLeft';
import { TaskTypeTab } from './useHeadings';

function getDueDateHeadingLabel(delta: number): string {
  let label = `${Math.floor(delta / 7)} weeks`;

  if (delta < 0) label = 'Overdue';
  else if (delta == 0) label = 'Today';
  else if (delta == 1) label = 'Tomorrow';
  else if (delta < 7) label = `${delta} days`;
  else if (delta < 14) label = '1 week';

  return label;
}

export function groupByDateHeadings(
  assignments: FinalAssignment[]
): Record<string, FinalAssignment[]> {
  const headings: Record<string, FinalAssignment[]> = {};
  assignments.forEach((a) => {
    if (a.needs_grading_count) {
      if (!('Needs Grading' in headings)) headings['Needs Grading'] = [];
      headings['Needs Grading'].push(a);
    } else {
      const daysLeft = getDueDateHeadingLabel(getDaysLeft(a));
      if (!(daysLeft in headings)) headings[daysLeft] = [];
      headings[daysLeft].push(a);
    }
  });
  return headings;
}

export function groupByStatusHeadings(
  assignments: FinalAssignment[],
  currentTab: TaskTypeTab = 'Completed'
): Record<string, FinalAssignment[]> {
  const headings: Record<string, FinalAssignment[]> = {
    Graded: [],
    Ungraded: [],
    Unread: [],
    Seen: [],
  };
  if (currentTab === 'Completed') {
    assignments.forEach((a) => {
      if (assignmentHasGrade(a)) headings['Graded'].push(a);
      else headings['Ungraded'].push(a);
    });
  } else if (currentTab === 'Announcements') {
    assignments.forEach((a) => {
      if (a.marked_complete) headings['Seen'].push(a);
      else headings['Unread'].push(a);
    });
  }
  return headings;
}
