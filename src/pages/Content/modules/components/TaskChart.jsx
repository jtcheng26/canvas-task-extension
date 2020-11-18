import React from 'react'
import styled from 'styled-components'

const ChartContainer = styled.div`
  height: 250px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #EFEFEF;
`

export default function TaskChart() {
  return (
    <ChartContainer>
      Chart
    </ChartContainer>
  )
}
