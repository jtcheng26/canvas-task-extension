import React from 'react';
import styled from 'styled-components';
import ReactApexChart from 'react-apexcharts';
import PropTypes from 'prop-types';
import '../../content.styles.css';

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
    labels.push(`${classes[course].done}/${classes[course].total}`);
  }
  const options = {
    chart: {
      height: 370,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '20px',
            offsetY: 16,
          },
          value: {
            offsetY: -20,
            fontSize: '25px',
            fontFamily: 'Roboto',
            fontWeight: 900,
            formatter(val) {
              return `${Math.floor(val)}%`;
            },
          },
          total: {
            show: true,
            fontSize: '13px',
            fontFamily: 'Roboto',
            fontWeight: 500,
            color: 'black',
            label: `${doneTotal}/${total}`,
            formatter() {
              if (total > 0) return `${Math.floor((100 * doneTotal) / total)}%`;
              else return '100%';
            },
          },
        },
        hollow: {
          size: '35%',
        },
      },
    },
    fill: {
      opacity: 1.0,
    },
    labels,
    colors,
  };
  const centerText = {
    position: 'absolute',
    left: '50%',
    transform: 'translate(-50%, 0)',
    top: '56%',
    margin: 'auto',
    zIndex: '10',
    color: 'black',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: '13px',
  };
  const complete = 'Complete';
  return (
    <ChartContainer>
      <ReactApexChart
        height={300}
        options={options}
        series={series}
        type="radialBar"
      />
      <div style={centerText}>{complete}</div>
    </ChartContainer>
  );
}

TaskChart.propTypes = {
  assignments: PropTypes.arrayOf(PropTypes.object).isRequired,
  courses: PropTypes.arrayOf(PropTypes.object).isRequired,
};
