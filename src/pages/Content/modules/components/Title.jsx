import React from 'react'
import styled from 'styled-components'

const TitleDiv = styled.div`
  border-bottom: 1px solid #C7CDD1;
  height: 30px;
  font-weight: bold;
  display: inline-block;
`

export default function Title({ weekStart, weekEnd }) {
  let start = weekStart.toLocaleString('en-US', { month: 'short', day: 'numeric' })
  let end = weekEnd.toLocaleString('en-US', { month: 'short', day: 'numeric' })
  return (
    <>
      <TitleDiv>
        <div style={{float: "left"}}>
          Tasks
        </div>
        <div style={{float: "right"}}>
          {`${start} to ${end}`}
        </div>
      </TitleDiv>
    </>
  )
}
