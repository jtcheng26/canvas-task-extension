import React, { useEffect, useMemo, useState } from 'react';
import CourseName from './CourseName';
import TaskChart from './TaskChart';
import TaskList from './TaskList';
import onCoursePage from '../utils/onCoursePage';
import sortByDate from '../utils/sortByDate';
import AssignmentMap from '../types/assignmentMap';
import assignmentsAsList from '../utils/assignmentsAsList';
import unfinished from '../utils/unfinished';
import { Assignment, Options } from '../types';
import { onlyUnlockedAssignments } from '../hooks/useAssignments';
import markAsComplete from '../utils/markAsComplete';
import assignmentsMarkedAsComplete from '../utils/assignmentsMarkedAsComplete';
import finished from '../utils/finished';
import { TaskListState } from '../types/taskListState';

interface TaskContainerProps {
  data: AssignmentMap;
  loading?: boolean;
  options: Options;
}

/*
  Main app component that renders all async content
*/

export default function TaskContainer({
  data,
  loading,
  options,
}: TaskContainerProps): JSX.Element {
  const onCourse = onCoursePage() ? true : false;
  const courses = Object.keys(data).map((c) => parseInt(c));
  const [course, setCourse] = useState(onCourse ? courses[0] : -1);
  const [assignmentData, setAssignmentData] = useState(data);
  const [assignmentsListState, setAssignmentsListState] = useState<
    TaskListState
  >('Unfinished');

  useEffect(() => {
    (async () => {
      const markedAsComplete = await assignmentsMarkedAsComplete();
      let filteredData = { ...data };
      Object.keys(filteredData).forEach((k) => {
        filteredData[k].forEach((assignment) => {
          if (markedAsComplete.has(assignment.id))
            assignment.user_submitted = true;
        });
      });
      filteredData = !options.show_locked_assignments
        ? onlyUnlockedAssignments(filteredData)
        : filteredData;
      setAssignmentData(filteredData);
    })();
  }, [data]);

  const listAssignments = useMemo(() => {
    let assignments = sortByDate(assignmentsAsList(assignmentData));
    if (assignmentsListState == 'Unfinished') {
      //unfinished assignments are assignments that are neither submitted nor graded
      assignments = unfinished(assignments);
    } else {
      assignments.reverse(); // show most recently completed assignments first
      assignments = finished(assignments);
    }
    return assignments;
  }, [assignmentData, assignmentsListState]);

  /* Allow a course filter to be maintained when course is not in period data */
  const selectedCourse = useMemo(() => {
    if (course !== -1 && !courses.includes(course)) return -1;
    return course;
  }, [loading, course, courses]);

  function markAssignmentAsComplete(assignment: Assignment) {
    const newAssignmentData = { ...assignmentData };
    newAssignmentData[assignment.course_id].forEach((a) => {
      if (a.id == assignment.id) {
        markAsComplete(a);
      }
    });
    setAssignmentData(newAssignmentData);
  }

  return (
    <>
      <CourseName
        courses={courses}
        onCoursePage={onCourse}
        selectedCourseId={selectedCourse}
        setCourse={setCourse}
      />
      <TaskChart
        assignments={assignmentData}
        loading={loading}
        selectedCourseId={selectedCourse}
        setCourse={setCourse}
      />
      <TaskList
        assignments={
          selectedCourse !== -1
            ? listAssignments.filter((a) => a.course_id === selectedCourse)
            : listAssignments
        }
        markAssignmentAsComplete={markAssignmentAsComplete}
        options={options}
        setTaskListState={setAssignmentsListState}
        taskListState={assignmentsListState}
      />
    </>
  );
}
