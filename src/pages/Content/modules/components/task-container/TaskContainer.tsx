import React, { useEffect, useMemo, useState } from 'react';
import CourseDropdown from '../course-dropdown';
import TaskChart from '../task-chart';
import TaskList from '../task-list';
import markAsComplete from './utils/markAsComplete';
import { Course, FinalAssignment, Options } from '../../types';
import extractCourses from './utils/extractCourses';
import { filterCourses } from '../../hooks/useAssignments';

export interface TaskContainerProps {
  assignments: FinalAssignment[];
  loading?: boolean;
  courseId?: number | false;
  courseList?: Course[]; // all courses, for corner case when on course page w/ no assignments
  options: Options;
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
}: TaskContainerProps): JSX.Element {
  const courses = useMemo(() => {
    if (courseList && courseId !== false)
      return courseList.filter((c) => c.id === courseId);
    return extractCourses(assignments);
  }, [assignments, courseId]);
  const [selectedCourseId, setSelectedCourseId] = useState<number>(
    courseList && courseId ? courseId : -1
  );
  // update assignments in state when marked as complete, then push updates asynchronously to local storage
  const [updatedAssignments, setUpdatedAssignments] =
    useState<FinalAssignment[]>(assignments);

  function markAssignmentAsComplete(id: number) {
    const newAssignments = updatedAssignments.map((a) => {
      if (a.id == id) return markAsComplete(a);
      return a;
    });
    setUpdatedAssignments(newAssignments);
  }

  // Don't let user switch courses when on a course page
  const chosenCourseId = courseId ? courseId : selectedCourseId;

  useEffect(() => {
    if (courseId && courseId !== -1)
      setUpdatedAssignments(filterCourses([courseId], assignments));
    else setUpdatedAssignments(assignments);
  }, [assignments, courseId]);

  return (
    <>
      <CourseDropdown
        courses={courses}
        onCoursePage={courseId ? true : false}
        selectedCourseId={chosenCourseId}
        setCourse={setSelectedCourseId}
      />
      <TaskChart
        assignments={updatedAssignments}
        colorOverride={
          courseId && courseId !== -1 ? courses[0].color : undefined
        }
        loading={loading}
        selectedCourseId={chosenCourseId}
        setCourse={setSelectedCourseId}
      />
      <TaskList
        assignments={updatedAssignments}
        markAssignmentAsComplete={markAssignmentAsComplete}
        selectedCourseId={chosenCourseId}
        showDateHeadings={options.due_date_headings}
      />
    </>
  );
}
