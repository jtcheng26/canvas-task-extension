import React from 'react'
import styled from 'styled-components'

const TaskContainer = styled.div`
  width: 100%;
  height: 70px;
  margin: 5px;
  background-color: #EFEFEF;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  font-weight: bold;
  font-size: 12px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
  &:hover {
    a {
      text-decoration: underline;
    }
    cursor: pointer;
    box-shadow: 0 5px 8px rgba(0,0,0,0.3);
  }
`

const TaskBottom = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 35px;
  border-radius: 0px 0px 4px 4px;
  padding-left: 15px;
  padding-top: 5px;
  color: #959595;
`

const TaskLink = styled.a`
  color: #FFFFFF;
  overflow-x: scroll;
  &:hover {
    color: #FFFFFF;
  }
`

export default function Task({ assignment }) { /* Demo Task */
  const due_at = new Date(assignment.due_at);
  const due_date = due_at.toLocaleString('en-US', { month: 'short', day: 'numeric' })
  const due_time = due_at.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  const TaskTopStyle = {
    boxSizing: "border-box",
    width: "100%",
    height: "35px",
    borderRadius: "4px 4px 0px 0px",
    paddingLeft: "15px",
    paddingTop: "15px",
    backgroundColor: assignment.color
  }
  return (
    <TaskContainer onClick={(e) => {
      e.preventDefault();
      window.location.href=assignment.html_url;
    }}>
      <div style={TaskTopStyle}>
        <TaskLink href={assignment.html_url}>
          {assignment.name}
        </TaskLink>
      </div>
      <TaskBottom>
        {parseFloat(assignment.points_possible) + " points \xa0|\xa0 " + due_date + " at " + due_time}
      </TaskBottom>
    </TaskContainer>
  )
}
