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

export default function TaskChart({
  courses,
  assignments,
  selectedCourseId,
  setCourse,
}) {
  const classes = {};
  const convertToIndex = {};
  courses.sort((a, b) => {
    return a.position < b.position;
  });
  let curr = 0;
  courses.forEach((course) => {
    convertToIndex[course.id] = curr++;
  });
  courses.forEach((course) => {
    classes[course.id] = {
      total: 0,
      done: 0,
      color: course.color,
      name: course.name,
      idx: convertToIndex[course.id],
    };
  });

  assignments.forEach((assignment) => {
    if (assignment.points_possible > 0) {
      classes[assignment.course_id].total++;
      if (assignment.user_submitted || assignment.grade > 0)
        classes[assignment.course_id].done++;
    }
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
        dataPointSelection: function (event) {
          const idx = event.srcElement.attributes.j.value;
          setCourse(parseInt(ids[idx]));
        },
      },
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          enabled: false,
          name: {
            formatter() {
              return '';
            },
          },
          value: {
            formatter() {
              return '';
            },
          },
          total: {
            formatter() {
              return '';
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
    colors,
  };
  const totalText = {
    fontSize: '25px',
    fontFamily: 'Lato Extended',
    fontWeight: 'bold',
    color: `${
      selectedCourseId === -1
        ? 'var(--ic-brand-font-color-dark)'
        : colors[classes[selectedCourseId].idx]
    }`,
    position: 'absolute',
    margin: 'auto',
    bottom: '49%',
    zIndex: '10',
  };
  const progressText = {
    fontSize: '13px',
    fontFamily: 'Lato Extended',
    fontWeight: 'bold',
    position: 'absolute',
    margin: 'auto',
    top: '50%',
    zIndex: '10',
    color: `${
      selectedCourseId === -1
        ? 'var(--ic-brand-font-color-dark)'
        : colors[classes[selectedCourseId].idx]
    }`,
  };
  const centerText = {
    position: 'absolute',
    left: '50%',
    transform: 'translate(-50%, 0)',
    top: '135px',
    margin: 'auto',
    zIndex: '10',
    color: `${
      selectedCourseId === -1
        ? 'var(--ic-brand-font-color-dark)'
        : colors[classes[selectedCourseId].idx]
    }`,
    fontFamily: 'Lato Extended',
    fontWeight: 'bold',
    fontSize: '13px',
  };
  const complete = 'Complete';
  const totalValue =
    selectedCourseId === -1
      ? total === 0
        ? '100%'
        : `${Math.floor((100 * doneTotal) / total)}%`
      : `${Math.floor(series[classes[selectedCourseId].idx])}%`;
  const progressValue =
    selectedCourseId === -1
      ? `${doneTotal}/${total}`
      : `${classes[selectedCourseId].done}/${classes[selectedCourseId].total}`;
  return (
    <ChartContainer>
      <ReactApexChart
        height={300}
        options={options}
        series={series}
        type="radialBar"
      />
      <div style={totalText}>{totalValue}</div>
      <div style={progressText}>{progressValue}</div>
      <div style={centerText}>{complete}</div>
    </ChartContainer>
  );
}

TaskChart.defaultProps = {
  selectedCourseId: -1,
  setCourse: () => {},
};

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
      is_quiz_assignment: PropTypes.bool,
      course_code: PropTypes.string,
      grade: PropTypes.number,
    })
  ).isRequired,
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      color: PropTypes.string,
      name: PropTypes.string,
      position: PropTypes.number,
    })
  ).isRequired,
  selectedCourseId: PropTypes.number,
  setCourse: PropTypes.func,
};
