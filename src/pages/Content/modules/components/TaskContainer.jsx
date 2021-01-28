import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CourseName from './CourseName';
import TaskChart from './TaskChart';
import TaskList from './TaskList';

export default function TaskContainer({ data }) {
  const [course, setCourse] = useState(-1);
  function setCourseCallback(id) {
    setCourse(id);
  }
  function compareDates(a, b) {
    return new Date(a.due_at) - new Date(b.due_at);
  }
  return (
    <>
      <CourseName
        courses={data.courses}
        selectedCourseId={course}
        setCourse={setCourseCallback}
      />
      <TaskChart
        assignments={data.assignments.sort(compareDates)}
        courses={data.courses}
        selectedCourseId={course}
        setCourse={setCourseCallback}
      />
      <TaskList assignments={data.assignments} course_id={course} />
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
