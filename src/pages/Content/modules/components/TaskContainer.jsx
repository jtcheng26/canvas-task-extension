import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CourseName from './CourseName';
import TaskChart from './TaskChart';
import TaskList from './TaskList';

/*
  Main app component that renders all async content
*/

export default function TaskContainer({ data }) {
  const [course, setCourse] = useState(-1);
  function compareDates(a, b) {
    return new Date(a.due_at) - new Date(b.due_at);
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

TaskContainer.propTypes = {
  data: PropTypes.shape({
    courses: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        color: PropTypes.string,
        name: PropTypes.string,
        position: PropTypes.number,
      })
    ),
    assignments: PropTypes.arrayOf(
      PropTypes.shape({
        color: PropTypes.string,
        html_url: PropTypes.string,
        name: PropTypes.string,
        points_possible: PropTypes.number,
        due_at: PropTypes.string,
        course_id: PropTypes.number,
        id: PropTypes.number,
        user_submitted: PropTypes.bool,
        is_quiz_assignment: PropTypes.bool,
        course_code: PropTypes.string,
        grade: PropTypes.number,
      })
    ),
  }).isRequired,
};
