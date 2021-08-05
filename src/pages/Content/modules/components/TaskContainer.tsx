import React, { useState } from 'react';
import CourseName from './CourseName';
import TaskChart from './TaskChart';
import TaskList from './TaskList';
import { Assignment, Data } from '../types';

interface TaskContainerProps {
  data: Data;
}

/*
  Main app component that renders all async content
*/

export default function TaskContainer({ data }: TaskContainerProps) {
  const url = location.pathname.split('/');
  const onCoursePage = url.length === 3 && url[url.length - 2] === 'courses';
  const [course, setCourse] = useState(onCoursePage ? data.courses[0].id : -1);
  function compareDates(a: Assignment, b: Assignment) {
    return new Date(a.due_at).valueOf() - new Date(b.due_at).valueOf();
  }
  data.assignments.sort(compareDates);
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
        onCoursePage={onCoursePage}
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
