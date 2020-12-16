import React from 'react';
import styled from 'styled-components';
import ReactApexChart from 'react-apexcharts';
import PropTypes from 'prop-types';
import '../../content.styles.css';

const ChartContainer = styled.div`
  height: 240px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 10px 0px 0px 0px;
`;

export default function TaskChart({ courses, assignments, setCourse }) {
  const classes = {};
  courses.map((course) => {
    classes[course.id] = {
      total: 0,
      done: 0,
      color: course.color,
      name: course.name,
      idx: course.position,
    };
  });
  assignments.forEach((assignment) => {
    classes[assignment.course_id].total++;
    if (assignment.user_submitted || assignment.grade > 0)
      classes[assignment.course_id].done++;
  });
  let doneTotal = 0,
    total = 0;
  const series = [],
    colors = [],
    labels = [],
    names = [],
    ids = [];
  for (const course in classes) {
    doneTotal += classes[course].done;
    total += classes[course].total;
    if (classes[course].total > 0)
      series[classes[course].idx] =
        (100 * classes[course].done) / classes[course].total;
    else series[classes[course].idx] = 100;
    colors[classes[course].idx] = classes[course].color;
    labels[
      classes[course].idx
    ] = `${classes[course].done}/${classes[course].total}`;
    names[classes[course].idx] = classes[course].name;
    ids[classes[course].idx] = course;
  }
  const options = {
    chart: {
      height: 370,
      type: 'radialBar',
      events: {
        dataPointMouseEnter: function (event) {
          const idx = event.srcElement.attributes.j.value;
          setCourse(names[idx], parseInt(ids[idx]), colors[idx]);
        },
        dataPointMouseLeave: function () {
          if (names.length == 1)
            setCourse(names[0], parseInt(ids[0]), colors[0]);
          else setCourse('-1', -1, 'black');
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
            color: '#000',
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
    top: '135px',
    margin: 'auto',
    zIndex: '10',
    color: '#000',
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
  assignments: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string,
      html_url: PropTypes.string,
      name: PropTypes.string,
      points_possible: PropTypes.number,
      due_at: PropTypes.string,
      course_id: PropTypes.number,
      id: PropTypes.number,
      user_submitted: PropTypes.bool,
    })
  ).isRequired,
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      color: PropTypes.string,
      name: PropTypes.string,
    })
  ).isRequired,
  setCourse: PropTypes.func.isRequired,
};
