import React from 'react';
import Title from './Title';
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
  return (
    <div style={style}>
      {!isPending && !error && (
        <Title weekEnd={data.nextMonday} weekStart={data.prevMonday} />
      )}
      {isPending && <h1>{loading}</h1>}
      {!isPending && !error && (
        <TaskChart
          assignments={data.assignments.sort(compareDates)}
          courses={data.courses}
        />
      )}
      {!isPending && !error && <TaskList assignments={data.assignments} />}
      {error && <h1>{failed}</h1>}
    </div>
  );
}
