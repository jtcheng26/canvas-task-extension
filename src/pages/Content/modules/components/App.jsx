import React, { useState } from 'react';
import Title from './Title';
import CourseName from './CourseName';
import TaskChart from './TaskChart';
import TaskList from './TaskList';
import MoonLoader from 'react-spinners/MoonLoader';
import { css } from '@emotion/core';
import { getRelevantAssignments } from '../api/APIcalls';
import { useAsync } from 'react-async';

function compareDates(a, b) {
  return new Date(a.due_at) - new Date(b.due_at);
}

export default function App() {
  const style = {
      display: 'flex',
      flexDirection: 'column',
    },
    { data, error, isPending } = useAsync({
      promiseFn: getRelevantAssignments,
    }),
    failed = 'Failed to load';
  const [course, setCourse] = useState({ code: '-1', id: -1, color: 'black' });
  function setCourseCallback(code, id, color) {
    setCourse({ code, id, color });
  }
  return (
    <div className="bootstrap-iso" style={style}>
      {!isPending && !error && (
        <Title weekEnd={data.nextMonday} weekStart={data.prevMonday} />
      )}
      {isPending && (
        <MoonLoader
          color="var(--ic-link-color)"
          css={css`
            align-self: center;
          `}
          loading
          size={50}
        />
      )}
      {!isPending && !error && (
        <>
          <CourseName
            color={
              data.courses.length > 1 ? course.color : data.courses[0].color
            }
            courseCode={
              data.courses.length > 1 ? course.code : data.courses[0].name
            }
          />
          <TaskChart
            assignments={data.assignments.sort(compareDates)}
            courses={data.courses}
            setCourse={setCourseCallback}
          />
        </>
      )}
      {!isPending && !error && (
        <TaskList assignments={data.assignments} course_id={course.id} />
      )}
      {error && <h1>{failed}</h1>}
    </div>
  );
}
