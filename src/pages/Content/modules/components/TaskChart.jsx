import React, { useState } from 'react';
import styled from 'styled-components';
import ReactApexChart from 'react-apexcharts';
import PropTypes from 'prop-types';
import '../../content.styles.css';

const ChartContainer = styled.div`
  height: 240px;
  padding-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
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
      name: course.name,
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
    labels = [],
    names = [];
  for (const course in classes) {
    doneTotal += classes[course].done;
    total += classes[course].total;
    if (classes[course].total > 0)
      series.push((100 * classes[course].done) / classes[course].total);
    else series.push(100);
    colors.push(classes[course].color);
    labels.push(`${classes[course].done}/${classes[course].total}`);
    names.push(classes[course].name);
  }
  const [hoverIdx, setHoverIdx] = useState(-1);
  const options = {
    chart: {
      height: 370,
      type: 'radialBar',
      events: {
        dataPointMouseEnter: function (event) {
          const idx = event.srcElement.attributes.j.value;
          setHoverIdx(idx);
        },
        dataPointMouseLeave: function () {
          setHoverIdx(-1);
        },
      },
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
    top: '155px',
    margin: 'auto',
    zIndex: '10',
    color: 'black',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: '13px',
  };
  const courseTitle = {
    position: 'absolute',
    height: '20px',
    top: '-5px',
    zIndex: '5',
    color:
      hoverIdx == -1 && colors.length > 1
        ? 'black'
        : colors.length > 1
        ? colors[hoverIdx]
        : colors[0],
    fontFamily: 'Lato Extended',
    fontWeight: 'bold',
    fontSize: '14px',
    lineHeight: '1.2',
    textAlign: 'center',
  };
  const complete = 'Complete';
  return (
    <ChartContainer>
      <div style={courseTitle}>
        {hoverIdx == -1 && names.length > 1
          ? 'All Courses'
          : names.length > 1
          ? names[hoverIdx]
          : names[0]}
      </div>
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
  assignments: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string,
      html_url: PropTypes.string,
      name: PropTypes.string,
      points_possible: PropTypes.number,
      due_at: PropTypes.string,
    })
  ).isRequired,
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      color: PropTypes.string,
    })
  ).isRequired,
};
