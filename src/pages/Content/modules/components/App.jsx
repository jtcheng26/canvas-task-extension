import React from 'react'
import Title from './Title'
import Subtitle from './Subtitle'
import TaskChart from './TaskChart'
import TaskList from './TaskList'
import axios from 'axios'
import { useAsync } from 'react-async'

function compareDates(a, b) {
  return new Date(a.due_at) - new Date(b.due_at)
}

function getPrevMonday() {
  var date = new Date();
  var day = date.getDay();
  var prevMonday = new Date();
  if (date.getDay() === 0) {
      prevMonday.setDate(date.getDate() - 7);
  }
  else {
      prevMonday.setDate(date.getDate() - (day-1));
  }

  return prevMonday;
}

function getNextMonday() {
  var d = new Date();
  d.setDate(d.getDate() + (1 + 7 - d.getDay()) % 7);
  return d
}

const getRelevantAssignments = async () => {
  let data
  let prev = getPrevMonday()
  let next = getNextMonday()
  try {
    let colors = await axios.get(`https://${location.hostname}/api/v1/users/self/colors`)
    colors = colors.data.custom_colors
    let courses = await axios.get(`https://${location.hostname}/api/v1/courses?per_page=100`)
    let names = {}
    courses = courses.data.filter((course) => {
      if ("name" in course) {
        names[course.id] = course.name
        return true
      }
      return false
    })
    let courseList = ""
    courses.map(course => {
      courseList += `&context_codes[]=course_${course.id}`
    })
    let assignments = await axios.get(`https://${location.hostname}/api/v1/calendar_events?type=assignment&start_date=${prev.toISOString()}&end_date=${next.toISOString()}&include=submission${courseList}`)
    let assignmentData = assignments.data.map(task => {
      return task.assignment
    })
    assignmentData = assignmentData.filter(task => {
      task.color = colors[`course_${task.course_id}`]
      task.course_name = names[task.course_id]
      const due = new Date(task.due_at)
      due.setHours(0, 0, 0, 0)
      prev.setHours(0, 0, 0, 0)
      next.setHours(0, 0, 0, 0)
      return due.valueOf() >= prev.valueOf() && due.valueOf() <= next.valueOf()
    })
    data = assignmentData
  }
  catch (error) {
    console.error(error)
  }
  return data
}

export default function App() {
  const style = {
    display: "flex",
    flexDirection: "column",
  }
  const { data, error, isPending } = useAsync({ promiseFn: getRelevantAssignments })
  let taskList = []
  if (!isPending && !error) {
    taskList = data.sort(compareDates)
  }
  return (
    <div style={style}>
      <Title weekStart={getPrevMonday()} weekEnd={getNextMonday()} />
      {isPending && <h1>Loading...</h1>}
      {!isPending && !error && <TaskChart assignments={taskList} />}
      {!isPending && !error &&
        <>
          <Subtitle />
          <TaskList assignments={taskList} />
        </>
      }
      {error && <h1>Failed to load</h1>}
    </div>
  )
}
