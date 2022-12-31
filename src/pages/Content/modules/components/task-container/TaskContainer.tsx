import React, { useEffect, useMemo, useState } from 'react';
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
import { shouldBreakStreak, taskOnTime } from '../../hooks/useStreak';

export interface TaskContainerProps {
  assignments: FinalAssignment[];
  loading?: boolean;
  courseId?: number | false;
  courseList?: Course[]; // all courses, for corner case when on course page w/ no assignments
  options: Options;
  startDate?: Date;
  endDate?: Date;
  streakList?: string[];
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

  function scheduleTimeout(a: FinalAssignment) {
    const dueAt = new Date(a.due_at).getTime();
    const now = new Date(Date.now()).getTime();
    const until = dueAt - now;
    if (until > 0) {
      return window.setTimeout(() => {
        setStreakCount(0);
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

  const [streakCount, setStreakCount] = useState(streakList.length);

  const themeColor = options.theme_color || OptionsDefaults.theme_color;

  // update assignments in state when marked as complete, then push updates asynchronously to local storage
  const [updatedAssignments, setUpdatedAssignments] =
    useState<FinalAssignment[]>(assignments);

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
          if (shouldBreakStreak(marked)) setStreakCount(0);
          else if (taskOnTime(marked)) setStreakCount(streakCount + 1);
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
          if (shouldBreakStreak(marked)) setStreakCount(0);
          else if (wasGood) {
            setStreakCount(streakCount - 1);
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
        if (shouldBreakStreak(assignment)) setStreakCount(0);
        else {
          addExplodingTimeout(assignment);
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

  useEffect(() => {
    if (streakLoaded) setStreakCount(streakList.length);
  }, [streakLoaded, setStreakCount, streakList]);

  return (
    <>
      <CourseDropdown
        courses={courses}
        onCoursePage={!!courseId}
        selectedCourseId={chosenCourseId}
        setCourse={setSelectedCourseId}
      />
      {options.show_streak && streakCount > 0 && (
        <StreakIndicator streak={streakCount} />
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
