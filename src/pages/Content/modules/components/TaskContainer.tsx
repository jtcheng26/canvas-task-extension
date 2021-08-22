import React, { useMemo, useState } from 'react';
import CourseName from './CourseName';
import TaskChart from './TaskChart';
import TaskList from './TaskList';
import onCoursePage from '../utils/onCoursePage';
import sortByDate from '../utils/sortByDate';
import AssignmentMap from '../types/assignmentMap';
import assignmentsAsList from '../utils/assignmentsAsList';
import useGrade from '../hooks/useGrade';

interface TaskContainerProps {
  data: AssignmentMap;
  loading?: boolean;
}

/*
  Main app component that renders all async content
*/

export default function TaskContainer({
  data,
  loading,
}: TaskContainerProps): JSX.Element {
  const onCourse = onCoursePage() ? true : false;
  const courses = Object.keys(data).map((c) => parseInt(c));
  const [course, setCourse] = useState(onCourse ? courses[0] : -1);
  const assignments = sortByDate(assignmentsAsList(data));
  /*
    unfinished assignments are assignments that are neither submitted nor graded
  */
  const unfinishedAssignments = assignments.filter((assignment) => {
    return !assignment.user_submitted && useGrade(assignment) === 0;
  });

  /* Allow a course filter to be maintained when course is not in period data */
  const selectedCourse = useMemo(() => {
    if (course !== -1 && !courses.includes(course)) return -1;
    return course;
  }, [loading, course, courses]);

  return (
    <>
      <CourseName
        courses={courses}
        onCoursePage={onCourse}
        selectedCourseId={selectedCourse}
        setCourse={setCourse}
      />
      <TaskChart
        assignments={data}
        loading={loading}
        selectedCourseId={selectedCourse}
        setCourse={setCourse}
      />
      <TaskList
        assignments={
          selectedCourse !== -1
            ? unfinishedAssignments.filter(
                (a) => a.course_id === selectedCourse
              )
            : unfinishedAssignments
        }
      />
    </>
  );
}
