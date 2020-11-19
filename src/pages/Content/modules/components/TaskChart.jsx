import React from 'react'
import styled from 'styled-components'

const ChartContainer = styled.div`
  height: 240px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #EFEFEF;
  margin: 10px 0px 5px 0px;
`

export default function TaskChart({ assignments }) {
  return (
    <ChartContainer>
      Chart
    </ChartContainer>
  )
}
