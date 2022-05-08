import React, { useMemo, useState } from 'react';
import CourseDropdown from '../course-dropdown';
import TaskChart from '../task-chart';
import TaskList from '../task-list';
import onCoursePage from '../../utils/onCoursePage';
import markAsComplete from './utils/markAsComplete';
import { FinalAssignment, Options } from '../../types';
import extractCourses from './utils/extractCourses';

export interface TaskContainerProps {
  assignments: FinalAssignment[];
  loading?: boolean;
  options: Options;
}

/*
  Main app component that renders all async content
*/

export default function TaskContainer({
  assignments,
  loading,
  options,
}: TaskContainerProps): JSX.Element {
  const onCourse = onCoursePage() ? true : false;
  const courses = useMemo(() => extractCourses(assignments), [assignments]);
  const [selectedCourseId, setSelectedCourseId] = useState<number>(
    onCourse ? courses[0].id : -1
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

  return (
    <>
      <CourseDropdown
        courses={courses}
        onCoursePage={onCourse}
        selectedCourseId={selectedCourseId}
        setCourse={setSelectedCourseId}
      />
      <TaskChart
        assignments={updatedAssignments}
        loading={loading}
        selectedCourseId={selectedCourseId}
        setCourse={setSelectedCourseId}
      />
      <TaskList
        assignments={updatedAssignments}
        markAssignmentAsComplete={markAssignmentAsComplete}
        selectedCourseId={selectedCourseId}
        showDateHeadings={options.due_date_headings}
      />
    </>
  );
}
