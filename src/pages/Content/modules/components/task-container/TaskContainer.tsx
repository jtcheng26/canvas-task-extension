import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CourseDropdown from '../course-dropdown';
import TaskChart from '../task-chart';
import TaskList from '../task-list';
import { Course, FinalAssignment, Options } from '../../types';
import extractCourses from './utils/extractCourses';
import { filterCourses, filterTimeBounds } from '../../hooks/useAssignments';
import markAssignment from './utils/markAssignment';
import deleteAssignment from './utils/deleteAssignment';
import { AssignmentStatus } from '../../types/assignment';
import { OptionsDefaults } from '../../constants';
import StreakIndicator from '../streak-indicator';
import {
  dateAfter,
  shouldBreakStreak,
  taskOnTime,
} from '../../hooks/useStreak';
import { sortByDate } from '../task-list/utils/sortBy';

export interface TaskContainerProps {
  assignments: FinalAssignment[];
  loading?: boolean;
  courseId?: number | false;
  courseList?: Course[]; // all courses, for corner case when on course page w/ no assignments
  options: Options;
  startDate?: Date;
  endDate?: Date;
  streakList?: FinalAssignment[]; // list of assignments part of streak, sorted by due date
  streakLoaded?: boolean;
}

/*
  Main app component that renders all async content
*/

export default function TaskContainer({
  assignments,
  courseId,
  courseList,
  loading,
  options,
  startDate,
  endDate,
  streakList = [],
  streakLoaded = false,
}: TaskContainerProps): JSX.Element {
  const [selectedCourseId, setSelectedCourseId] = useState<number>(
    courseList && courseId ? courseId : -1
  );

  const [updatedStreakList, setUpdatedStreakList] = useState(streakList);
  const [streakBreakDate, setStreakBreakDate] = useState<string>('');

  // const setStreakBreakPoint = useCallback(
  //   (assignment: FinalAssignment) => {
  //     setStreakBreakDate(assignment.due_at);
  //     console.log('breaking', assignment.due_at);
  //     // setUpdatedStreakList(
  //     //   updatedStreakList.filter((a) => dateAfter(a.due_at, assignment.due_at))
  //     // );
  //   },
  //   [updatedStreakList, setUpdatedStreakList]
  // );

  const setStreakBreak = useCallback(
    (a: FinalAssignment) => {
      if (streakBreakDate === '' || dateAfter(a.due_at, streakBreakDate))
        setStreakBreakDate(a.due_at);
    },
    [streakBreakDate]
  );

  // useEffect(() => {
  //   const seen: Record<number, boolean> = {};
  //   const newStreakList = updatedStreakList.concat(assignments).filter((a) => {
  //     if (a.id in seen) return false;
  //     seen[a.id] = true;
  //     return true;
  //   });
  //   setUpdatedStreakList(newStreakList);
  // }, [assignments]);

  useEffect(() => {
    if (streakLoaded) {
      console.log('Updating');
      setUpdatedStreakList(streakList);
      if (streakList.length > 0) {
        const breakDate = new Date(
          new Date(streakList[0].due_at).getTime() - 1000
        ).toISOString();
        setStreakBreakDate(breakDate);
      }
    }
  }, [streakList, streakLoaded]);

  function scheduleTimeout(a: FinalAssignment) {
    const dueAt = new Date(a.due_at).getTime();
    const now = new Date(Date.now()).getTime();
    const until = dueAt - now;
    if (until > 0) {
      return window.setTimeout(() => {
        setStreakBreak(a);
      }, until);
    }

    return false;
  }

  const [explodeTimeouts, setExplodeTimeouts] = useState<
    Record<number, number>
  >({});

  useMemo(() => {
    const timeouts: Record<number, number> = {};
    assignments.forEach((a) => {
      if (!taskOnTime(a) && !shouldBreakStreak(a)) {
        const to = scheduleTimeout(a);
        if (to) timeouts[a.id] = to;
      }
    });
    setExplodeTimeouts(timeouts);
  }, [assignments]);

  function addExplodingTimeout(a: FinalAssignment) {
    const to = scheduleTimeout(a);
    if (to) {
      const timeout = {
        [a.id]: to,
      };
      setExplodeTimeouts({ ...explodeTimeouts, ...timeout });
    }
  }

  function cancelExplodingTimeout(a: FinalAssignment) {
    clearTimeout(explodeTimeouts[a.id]);
    delete explodeTimeouts[a.id];
    setExplodeTimeouts(explodeTimeouts);
  }

  const themeColor = options.theme_color || OptionsDefaults.theme_color;

  // update assignments in state when marked as complete, then push updates asynchronously to local storage
  const [updatedAssignments, setUpdatedAssignments] =
    useState<FinalAssignment[]>(assignments);

  const sortedAssignments = useMemo(() => {
    return sortByDate(updatedAssignments);
  }, [updatedAssignments]);

  const initialStreakCount = useMemo(() => {
    console.log('str');
    // console.log(streakList, updatedStreakList);
    if (sortedAssignments.length === 0) return updatedStreakList.length;
    const oldestDisplayed = sortedAssignments[0];
    const newestDisplayed = sortedAssignments[sortedAssignments.length - 1];
    return updatedStreakList.filter((a) => {
      if (!dateAfter(a.due_at, streakBreakDate))
        console.log('BAD', a.due_at, streakBreakDate);
      return (
        dateAfter(a.due_at, streakBreakDate) &&
        (dateAfter(oldestDisplayed.due_at, a.due_at) ||
          dateAfter(a.due_at, newestDisplayed.due_at))
      );
    }).length;
  }, [sortedAssignments, streakBreakDate, updatedStreakList]);

  const partOfStreak = useMemo(() => {
    return updatedAssignments.filter(
      (a) => dateAfter(a.due_at, streakBreakDate) && taskOnTime(a)
    );
  }, [streakBreakDate, updatedAssignments]);

  console.log(initialStreakCount, partOfStreak);

  const courses = useMemo(() => {
    if (courseList && courseId !== false)
      return courseList.filter((c) => c.id === courseId);
    return extractCourses(updatedAssignments);
  }, [updatedAssignments, courseId]);

  async function markAssignmentComplete(id: number) {
    setUpdatedAssignments(
      updatedAssignments.map((a) => {
        if (a.id == id) {
          const marked = markAssignment(AssignmentStatus.COMPLETE, a);
          cancelExplodingTimeout(a);
          return marked;
        }
        return a;
      })
    );
  }

  async function markAssignmentUnfinished(id: number) {
    setUpdatedAssignments(
      updatedAssignments.map((a) => {
        if (a.id == id) {
          const wasGood = taskOnTime(a);
          const marked = markAssignment(AssignmentStatus.UNFINISHED, a);
          if (shouldBreakStreak(a)) {
            setStreakBreak(a);
          } else if (wasGood) {
            addExplodingTimeout(a);
          }
          return marked;
        }
        return a;
      })
    );
  }

  async function markAssignmentDeleted(id: number) {
    setUpdatedAssignments(
      updatedAssignments.filter((a) => {
        if (a.id == id) {
          deleteAssignment(a);
          return false;
        }
        return true;
      })
    );
  }

  async function markAssignmentAs(id: number, status: AssignmentStatus) {
    if (status === AssignmentStatus.DELETED) {
      markAssignmentDeleted(id);
    } else if (status === AssignmentStatus.UNFINISHED) {
      markAssignmentUnfinished(id);
    } else {
      markAssignmentComplete(id);
    }
  }

  async function createNewAssignment(assignment: FinalAssignment) {
    if (startDate && endDate) {
      const withinBounds = filterTimeBounds(startDate, endDate, [assignment]);
      if (withinBounds.length) {
        const newAssignments = updatedAssignments.concat(withinBounds);
        setUpdatedAssignments(newAssignments);
        if (!shouldBreakStreak(assignment)) {
          addExplodingTimeout(assignment);
        } else {
          setStreakBreak(assignment);
        }
      }
    }
  }

  // Don't let user switch courses when on a course page
  const chosenCourseId = courseId ? courseId : selectedCourseId;

  useEffect(() => {
    if (courseId && courseId !== -1)
      setUpdatedAssignments(filterCourses([courseId], assignments));
    else setUpdatedAssignments(assignments);
  }, [assignments, courseId]);

  // useEffect(() => {
  //   if (streakLoaded)
  // }, [streakLoaded, setStreakCount, streakList]);

  return (
    <>
      <CourseDropdown
        courses={courses}
        onCoursePage={!!courseId}
        selectedCourseId={chosenCourseId}
        setCourse={setSelectedCourseId}
      />
      {options.show_streak &&
        streakLoaded &&
        initialStreakCount + partOfStreak.length > 0 && (
          <StreakIndicator streak={initialStreakCount + partOfStreak.length} />
        )}
      <TaskChart
        assignments={updatedAssignments}
        colorOverride={
          courseId && courseId !== -1 ? courses[0].color : undefined
        }
        loading={loading}
        onCoursePage={!!courseId}
        selectedCourseId={chosenCourseId}
        setCourse={setSelectedCourseId}
        showConfetti={options.show_confetti}
        showStreak={options.show_streak}
        themeColor={themeColor}
      />
      <TaskList
        assignments={updatedAssignments}
        createAssignment={createNewAssignment}
        markAssignment={markAssignmentAs}
        selectedCourseId={chosenCourseId}
        showConfetti={options.show_confetti}
        showDateHeadings={options.due_date_headings}
      />
    </>
  );
}
