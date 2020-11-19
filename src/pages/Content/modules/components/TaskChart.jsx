import React from 'react'
import styled from 'styled-components'
import ReactApexChart from 'react-apexcharts'

const ChartContainer = styled.div`
  height: 240px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0px 0px 0px;
`

export default function TaskChart({ assignments }) {
  const classes = {}
  assignments.forEach(assignment => {
    if (!(assignment.course_id in classes))
      classes[assignment.course_id] = { total: 0, done: 0 }
    classes[assignment.course_id].total++
    if (assignment.submission.attempt !== null)
      classes[assignment.course_id].done++
    classes[assignment.course_id].color = assignment.color
    classes[assignment.course_id].name = assignment.course_name
  })
  let doneTotal = 0
  let total = 0
  const series = []
  const colors = []
  const labels = []
  for (let course in classes) {
    doneTotal += classes[course].done
    total += classes[course].total
    series.push(100 * classes[course].done / classes[course].total)
    colors.push(classes[course].color)
    labels.push(classes[course].name)
  }
  const options = {
    chart: {
      height: 350,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '20px',
            offsetY: 25,
            formatter: function (val) {
              return "Complete"
            }
          },
          value: {
            offsetY: -15,
            fontSize: '30px',
            fontWeight: 'bold',
            formatter: function (val) {
              return Math.floor(val) + '%'
            }
          },
          total: {
            show: true,
            label: 'Complete',
            formatter: function (val) {
              return Math.floor(100 * doneTotal / total) + '%'
            }
          }
        }
      }
    },
    labels: labels,
    colors: colors
  }
  return (
    <ChartContainer>
      <ReactApexChart series={series} options={options} type="radialBar" height={300} />
    </ChartContainer>
  )
}
