import React, { useState } from 'react';
import CourseName from './CourseName';
import TaskChart from './TaskChart';
import TaskList from './TaskList';
import { Data } from '../types';
import onCoursePage from '../utils/onCoursePage';
import sortByDate from '../utils/sortByDate';

interface TaskContainerProps {
  data: Data;
}

/*
  Main app component that renders all async content
*/

export default function TaskContainer({
  data,
}: TaskContainerProps): JSX.Element {
  const onCourse = onCoursePage();
  const [course, setCourse] = useState(onCourse ? data.courses[0].id : -1);
  data.assignments = sortByDate(data.assignments);
  /*
    unfinished assignments are assignments that are neither submitted nor graded
  */
  const unfinishedAssignments = data.assignments.filter((assignment) => {
    return !assignment.user_submitted && assignment.grade === 0;
  });
  const finishedAssignments = data.assignments.filter((assignment) => {
    return assignment.user_submitted || assignment.grade !== 0;
  });
  return (
    <>
      <CourseName
        courses={data.courses}
        onCoursePage={onCourse}
        selectedCourseId={course}
        setCourse={setCourse}
      />
      <TaskChart
        courses={data.courses}
        finishedAssignments={finishedAssignments}
        selectedCourseId={course}
        setCourse={setCourse}
        unfinishedAssignments={unfinishedAssignments}
      />
      <TaskList assignments={unfinishedAssignments} selectedCourseId={course} />
    </>
  );
}
