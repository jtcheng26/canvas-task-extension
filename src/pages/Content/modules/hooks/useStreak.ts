import { useQuery, UseQueryResult } from 'react-query';
import { FinalAssignment, Options } from '../types';
import useAssignments from './useAssignments';

/* 

Algorithm:
Runs on extension load and when switching between weeks

Fetch tasks due between now and last load
Check for last point where streak was broken:
    Most recent due date such that assignment was not completed on time
        Marked complete, submitted, or graded after due date, in that order
Add all on-time tasks completed after break point to current streak
Update last load time in storage

Keep a "freeze" point where no tasks before that date can affect the streak (ex. new created/old deleted)
Everything since that point is fetched and processed on every load via the above process
Once "freeze" point is too old, it is updated using the currently loaded data
When tasks are manually marked, streak is updated visually (plus 1 for on time completions, -1/clear for re-dos)

*/

/* Return true if timestamp a comes before b. If b is empty string, assume a is newer. */
export function dateAfter(a: string, b: string): boolean {
  if (!b) return true;
  if (!a) return false;
  return new Date(a) > new Date(b);
}

/* Check if task is completed on time (should be part of streak) */
export function taskOnTime(task: FinalAssignment): boolean {
  if (task.marked_complete) {
    return dateAfter(task.due_at, task.marked_at || '');
  } else if (task.submitted) {
    return !task.submitted_late;
  } else if (task.graded) {
    return dateAfter(task.due_at, task.graded_at);
  }
  return false;
}

/* Check if task is overdue: Marked complete, submitted, or graded after due date, in that order */
export function shouldBreakStreak(task: FinalAssignment): boolean {
  if (task.marked_complete) {
    return dateAfter(task.marked_at || '', task.due_at);
  } else if (task.submitted) {
    return !!task.submitted_late;
  } else if (task.graded) {
    return dateAfter(task.graded_at, task.due_at);
  }
  // if not submitted
  const now = Date.now();
  const due = new Date(task.due_at).getTime();
  return now > due;
}

function extractBreakDate(tasks: FinalAssignment[]): string {
  return tasks.reduce((prev, curr) => {
    if (dateAfter(curr.due_at, prev) && shouldBreakStreak(curr))
      return curr.due_at;
    return prev;
  }, '');
}

function filterStreak(
  tasks: FinalAssignment[],
  afterThisDate: string
): FinalAssignment[] {
  return tasks.filter(
    (task) => dateAfter(task.due_at, afterThisDate) && taskOnTime(task)
  );
}

function computeStreak(tasks: FinalAssignment[]): FinalAssignment[] {
  console.log('computing strak');
  const breakDate = extractBreakDate(tasks);
  console.log(breakDate);
  const res = filterStreak(tasks, breakDate);
  console.log(res);
  return res;
}

function getPreviousLoad(): Date {
  return new Date(2022, 1, 1);
}

export default function useStreak(
  options: Options
): UseQueryResult<FinalAssignment[]> {
  const startDate = getPreviousLoad();
  const { data: tasks } = useAssignments(startDate, undefined, options, true);
  return useQuery(
    ['streak', startDate],
    () => computeStreak(tasks as FinalAssignment[]),
    {
      staleTime: Infinity,
      enabled: !!tasks,
    }
  );
}
