import { FinalAssignment } from '../../../types';
import getDaysLeft from './getDaysLeft';

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
    const daysLeft = getDueDateHeadingLabel(getDaysLeft(a));
    if (!(daysLeft in headings)) headings[daysLeft] = [];
    headings[daysLeft].push(a);
  });
  return headings;
}

export function groupByStatusHeadings(
  assignments: FinalAssignment[]
): Record<string, FinalAssignment[]> {
  const headings: Record<string, FinalAssignment[]> = {
    Ungraded: [],
    Graded: [],
  };
  assignments.forEach((a) => {
    if (a.graded) headings['Graded'].push(a);
    else headings['Ungraded'].push(a);
  });
  return headings;
}
