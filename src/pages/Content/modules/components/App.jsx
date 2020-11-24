import React, { useState } from 'react';
import Title from './Title';
import CourseName from './CourseName';
import TaskChart from './TaskChart';
import TaskList from './TaskList';
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
    loading = 'Loading...',
    failed = 'Failed to load';
  const [course, setCourse] = useState({ code: '-1', color: 'black' });
  function setCourseCallback(code, color) {
    setCourse({ code, color });
  }
  return (
    <div style={style}>
      {!isPending && !error && (
        <Title weekEnd={data.nextMonday} weekStart={data.prevMonday} />
      )}
      {isPending && <h1>{loading}</h1>}
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
        <TaskList assignments={data.assignments} course={course.code} />
      )}
      {error && <h1>{failed}</h1>}
    </div>
  );
}
