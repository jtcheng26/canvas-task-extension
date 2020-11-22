import React from 'react';
import styled from 'styled-components';
import ReactApexChart from 'react-apexcharts';
import PropTypes from 'prop-types';

const ChartContainer = styled.div`
  height: 240px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0px 0px 0px;
`;

export default function TaskChart({ courses, assignments }) {
  const classes = {};
  courses.map((course) => {
    classes[course.id] = {
      total: 0,
      done: 0,
      color: course.color,
    };
  });
  assignments.forEach((assignment) => {
    classes[assignment.course_id].total++;
    if (assignment.submission.attempt !== null)
      classes[assignment.course_id].done++;
  });
  let doneTotal = 0,
    total = 0;
  const series = [],
    colors = [],
    labels = [];
  for (const course in classes) {
    doneTotal += classes[course].done;
    total += classes[course].total;
    if (classes[course].total > 0)
      series.push((100 * classes[course].done) / classes[course].total);
    else series.push(100);
    colors.push(classes[course].color);
    labels.push(course);
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
            formatter() {
              return 'Complete';
            },
          },
          value: {
            offsetY: -15,
            fontSize: '30px',
            fontWeight: 'bold',
            formatter(val) {
              return `${Math.floor(val)}%`;
            },
          },
          total: {
            show: true,
            label: 'Complete',
            formatter() {
              return `${Math.floor((100 * doneTotal) / total)}%`;
            },
          },
        },
      },
    },
    labels,
    colors,
  };
  return (
    <ChartContainer>
      <ReactApexChart
        height={300}
        options={options}
        series={series}
        type="radialBar"
      />
    </ChartContainer>
  );
}

TaskChart.propTypes = {
  assignments: PropTypes.arrayOf(PropTypes.object).isRequired,
  courses: PropTypes.arrayOf(PropTypes.object).isRequired,
};
