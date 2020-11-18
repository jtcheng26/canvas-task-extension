import React from 'react'
import Title from './Title'
import TaskChart from './TaskChart'
import TaskList from './TaskList'

export default function App() {
  const style = {
    display: "flex",
    flexDirection: "column",
  }
  return (
    <div style={style}>
      <Title />
      <TaskChart />
      <TaskList />
    </div>
  )
}
