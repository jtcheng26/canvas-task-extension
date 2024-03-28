import { useState, useEffect } from 'react';
import { Options, FinalAssignment, AssignmentType } from '../../types';
import { UseAssignmentsHookInterface } from '../../types/config';
import assignmentIsDone from '../../utils/assignmentIsDone';

// Use default values from 'full', only filling in values from 'partial' that are not null/undefined
export function mergePartial<T>(partial: Partial<T>, full: T): T {
  const ret = {
    ...full,
  };
  Object.keys(partial).forEach((k) => {
    const prop = k as keyof T;
    if (partial[prop] !== null && typeof partial[prop] !== 'undefined')
      ret[prop] = partial[prop] as never;
  });
  return ret;
}

/* Only assignments between the exact datetimes */
export function filterTimeBounds(
  startDate: Date,
  endDate: Date,
  assignments: FinalAssignment[],
  excludeNeedsGrading?: boolean,
  excludeLongOverdue?: boolean
): FinalAssignment[] {
  return assignments.filter((assignment) => {
    if (excludeNeedsGrading && assignment.needs_grading_count) return true;
    const due_date = new Date(assignment.due_at);
    const now = new Date().valueOf();
    if (
      excludeLongOverdue &&
      due_date.valueOf() < now &&
      !assignmentIsDone(assignment)
    )
      return true;
    return (
      due_date.valueOf() >= startDate.valueOf() &&
      due_date.valueOf() < endDate.valueOf()
    );
  });
}

/* Only assignments from the specified courses */
export function filterCourses(
  courses: string[],
  assignments: FinalAssignment[]
): FinalAssignment[] {
  const courseSet = new Set(courses);
  return assignments.filter((assignment) => {
    return (
      (assignment.course_id === '0' || !!assignment.course_id) &&
      courseSet.has(assignment.course_id)
    );
  });
}

/* Only where type is assignment, discussion, quiz, or planner note */
export function filterAssignmentTypes(
  assignments: FinalAssignment[]
): FinalAssignment[] {
  const validAssignments = [
    AssignmentType.ASSIGNMENT,
    AssignmentType.DISCUSSION,
    AssignmentType.QUIZ,
    AssignmentType.NOTE,
    AssignmentType.ANNOUNCEMENT,
    AssignmentType.GRADESCOPE,
  ];
  return assignments.filter((assignment) =>
    validAssignments.includes(assignment.type)
  );
}

export function processAssignmentList(
  assignments: FinalAssignment[],
  startDate: Date,
  endDate: Date,
  options: Options,
  onCoursePage: () => false | string,
  dash?: Set<string>
): FinalAssignment[] {
  assignments = filterAssignmentTypes(assignments);
  assignments = filterTimeBounds(startDate, endDate, assignments);

  const coursePageId = onCoursePage();

  if (coursePageId !== false) {
    // if on course page, only that course's assignments are shown
    assignments = filterCourses([coursePageId], assignments);
  } else {
    // if dash_courses set, only show assignments from courses on dashboard
    if (options.dash_courses && dash)
      assignments = filterCourses(Array.from(dash).concat(['0']), assignments);
  }
  return assignments;
}

export function makeUseAssignments(
  loader: (
    startDate: Date,
    endDate: Date,
    options: Options
  ) => Promise<FinalAssignment[]>
) {
  return (startDate: Date, endDate: Date, options: Options) => {
    const [state, setState] = useState<UseAssignmentsHookInterface>({
      data: null,
      isError: false,
      isSuccess: false,
      errorMessage: '',
    });
    useEffect(() => {
      setState({
        data: state.data,
        isError: false,
        isSuccess: false,
        errorMessage: '',
      });
      loader(startDate, endDate, options)
        .then((res: FinalAssignment[]) => {
          setState({
            data: res,
            isSuccess: true,
            isError: false,
            errorMessage: '',
          });
        })
        .catch((err) => {
          console.error(err);
          setState({
            data: state.data,
            isError: true,
            isSuccess: false,
            errorMessage: err.message,
          });
        });
    }, [startDate, endDate]);
    return state;
  };
}
