import React from 'react'
import styled from 'styled-components'

const TitleDiv = styled.div`
  border-bottom: 1px solid #C7CDD1;
  height: 30px;
  font-weight: bold;
`

export default function Title() {
  return (
    <>
      <TitleDiv>
        Tasks
      </TitleDiv>
    </>
  )
}
