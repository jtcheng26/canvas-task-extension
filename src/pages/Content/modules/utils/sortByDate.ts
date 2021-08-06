import { Assignment } from '../types';

export default function sortByDate(assignments: Assignment[]) {
  function compareDates(a: Assignment, b: Assignment) {
    return new Date(a.due_at).valueOf() - new Date(b.due_at).valueOf();
  }
  return assignments.sort(compareDates);
}
