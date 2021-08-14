import React, { useState } from 'react';
import CourseName from './CourseName';
import TaskChart from './TaskChart';
import TaskList from './TaskList';
import { Data } from '../types';
import onCoursePage from '../utils/onCoursePage';
import sortByDate from '../utils/sortByDate';
import AssignmentMap from '../types/assignmentMap';
import assignmentsAsList from '../utils/assignmentsAsList';
import useGrade from '../hooks/useGrade';

interface TaskContainerProps {
  data: AssignmentMap;
}

/*
  Main app component that renders all async content
*/

export default function TaskContainer({
  data,
}: TaskContainerProps): JSX.Element {
  const onCourse = onCoursePage();
  const courses = Object.keys(data).map((c) => parseInt(c));
  const [course, setCourse] = useState(onCourse ? courses[0] : -1);
  const assignments = sortByDate(assignmentsAsList(data));
  /*
    unfinished assignments are assignments that are neither submitted nor graded
  */
  const unfinishedAssignments = assignments.filter((assignment) => {
    return !assignment.user_submitted && useGrade(assignment) === 0;
  });
  const finishedAssignments = assignments.filter((assignment) => {
    return assignment.user_submitted || useGrade(assignment) !== 0;
  });
  return (
    <>
      <CourseName
        courses={courses}
        onCoursePage={onCourse}
        selectedCourseId={course}
        setCourse={setCourse}
      />
      {/* <TaskChart
        courses={data.courses}
        finishedAssignments={finishedAssignments}
        selectedCourseId={course}
        setCourse={setCourse}
        unfinishedAssignments={unfinishedAssignments}
      /> */}
      <TaskList
        assignments={
          course !== -1
            ? unfinishedAssignments.filter((a) => a.course_id === course)
            : unfinishedAssignments
        }
      />
    </>
  );
}
