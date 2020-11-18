import React from 'react'
import styled from 'styled-components'

const ListContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0px;
  overflow-y: scroll;
`

export default function TaskList() {
  return (
    <ListContainer>
      <div>Task 1</div>
      <div>Task 2</div>
      <div>Task 3</div>
      <div>Task 4</div>
      <div>Task 5</div>
      <div>Task 6</div>
    </ListContainer>
  )
}
