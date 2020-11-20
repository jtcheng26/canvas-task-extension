import React from 'react'
import Title from './Title'
import Subtitle from './Subtitle'
import TaskChart from './TaskChart'
import TaskList from './TaskList'
import { getRelevantAssignments } from '../api/APIcalls'
import { useAsync } from 'react-async'

function compareDates(a, b) {
  return new Date(a.due_at) - new Date(b.due_at)
}

export default function App() {
  const style = {
    display: "flex",
    flexDirection: "column",
  }
  const { data, error, isPending } = useAsync({ promiseFn: getRelevantAssignments })
  return (
    <div style={style}>
      {!isPending && !error && <Title weekStart={data.prevMonday} weekEnd={data.nextMonday} />}
      {isPending && <h1>Loading...</h1>}
      {!isPending && !error && <TaskChart courses={data.courses} assignments={data.assignments.sort(compareDates)} />}
      {!isPending && !error &&
        <>
          <Subtitle />
          <TaskList assignments={data.assignments} />
        </>
      }
      {error && <h1>Failed to load</h1>}
    </div>
  )
}
