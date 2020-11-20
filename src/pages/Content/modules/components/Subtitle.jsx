import React from 'react'
import styled from 'styled-components'

const SubtitleDiv = styled.div`
  border-bottom: 1px solid #C7CDD1;
  height: 25px;
`

export default function Subtitle() {
  return (
    <>
      <SubtitleDiv>
        <div style={{float: "left"}}>
          Unfinished
        </div>
      </SubtitleDiv>
    </>
  )
}
