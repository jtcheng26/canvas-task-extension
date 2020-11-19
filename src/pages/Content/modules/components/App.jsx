import React from 'react'
import Title from './Title'
import TaskChart from './TaskChart'
import TaskList from './TaskList'
import axios from 'axios'
import { useAsync } from 'react-async'

const getRelevantAssignments = async () => {
  let data
  try {
    let colors = await axios.get(`https://${location.hostname}/api/v1/users/self/colors`)
    colors = colors.data.custom_colors
    let courses = await axios.get(`https://${location.hostname}/api/v1/courses?per_page=100`)
    courses = courses.data.filter((course) => {
      return "name" in course
    })
    let totalAssignments = []
    let assignments = courses.map(course => {
      return axios.get(`https://${location.hostname}/api/v1/courses/${course.id}/assignments?per_page=100&include=submission`)
    })
    assignments = await axios.all(assignments)
    assignments.forEach(assignment => {
      let assignmentsData = assignment.data.filter(task => {
        task.color = colors[`course_${task.course_id}`]
        return task.submission.attempt == null && new Date(task.due_at) > Date.now()
      })
      totalAssignments = totalAssignments.concat(assignmentsData)
    })
    data = totalAssignments
  }
  catch (error) {
    console.error(error)
  }
  return data
}

function cmp(a, b) {
  return new Date(a.due_at) - new Date(b.due_at)
}

export default function App() {
  const style = {
    display: "flex",
    flexDirection: "column",
  }
  const { data, error, isPending } = useAsync({ promiseFn: getRelevantAssignments })
  let taskList = []
  if (!isPending && !error) {
    let assignments = data.sort(cmp)
    taskList = assignments.filter(assignment => {
      let due = new Date(assignment.due_at)
      return due > Date.now()
    })
  }
  return (
    <div style={style}>
      <Title />
      {isPending && <h1>Loading...</h1>}
      {!isPending && !error && <TaskChart assignments={taskList} />}
      {!isPending && !error && <TaskList assignments={taskList} />}
      {error && <h1>Failed to load</h1>}
    </div>
  )
}
