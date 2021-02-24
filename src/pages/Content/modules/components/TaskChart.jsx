import React from 'react';
import styled from 'styled-components';
import ReactApexChart from 'react-apexcharts';
import PropTypes from 'prop-types';
import '../../content.styles.css';

/*
  Renders progress chart
*/

const ChartContainer = styled.div`
  height: 220px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
`;

const TotalText = styled.div`
  font-size: 25px;
  font-family: Lato Extended;
  font-weight: bold;
  color: ${(props) => props.color};
  position: absolute;
  margin: auto;
  bottom: 49%;
  zindex: 10;
`;

const ProgressText = styled.div`
  font-size: 13px;
  font-family: Lato Extended;
  font-weight: bold;
  position: absolute;
  margin: auto;
  top: 50%;
  z-index: 10;
  color: ${(props) => props.color};
`;

const CompleteText = styled.div`
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  top: 125px;
  margin: auto;
  z-index: 10;
  color: ${(props) => props.color};
  font-family: Lato Extended;
  font-weight: bold;
  font-size: 13px;
`;

export default function TaskChart({
  courses,
  unfinishedAssignments,
  finishedAssignments,
  selectedCourseId,
  setCourse,
}) {
  const series = [],
    colors = [],
    labels = [],
    names = [],
    ids = [],
    classes = {};
  let doneTotal = 0,
    total = 0;
  if (courses.length > 0) {
    const convertToIndex = {};
    courses.sort((a, b) => {
      return a.position - b.position;
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
    unfinishedAssignments.forEach((assignment) => {
      if (!assignment.points_possible) classes[assignment.course_id].done++;
      classes[assignment.course_id].total++;
    });
    finishedAssignments.forEach((assignment) => {
      if (assignment.points_possible) {
        classes[assignment.course_id].done++;
        classes[assignment.course_id].total++;
      }
    });
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
  } else {
    series.push(100);
    colors.push('#000000');
    ids.push(-1);
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
        track: {
          margin: courses.length > 5 ? 1.5 : 5,
        },
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
          size: colors.length < 4 ? '40%' : '35%',
        },
      },
    },
    fill: {
      opacity: 1.0,
    },
    colors,
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
  const centerColor =
    selectedCourseId === -1
      ? 'var(--ic-brand-font-color-dark)'
      : colors[classes[selectedCourseId].idx];
  return (
    <ChartContainer>
      <ReactApexChart
        height={280}
        options={options}
        series={series}
        type="radialBar"
      />
      <TotalText color={centerColor}>{totalValue}</TotalText>
      <ProgressText color={centerColor}>{progressValue}</ProgressText>
      <CompleteText color={centerColor}>{complete}</CompleteText>
    </ChartContainer>
  );
}

TaskChart.defaultProps = {
  selectedCourseId: -1,
  setCourse: () => {},
};

TaskChart.propTypes = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      color: PropTypes.string,
      name: PropTypes.string,
      position: PropTypes.number,
    })
  ).isRequired,
  finishedAssignments: PropTypes.arrayOf(
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
  selectedCourseId: PropTypes.number,
  setCourse: PropTypes.func,
  unfinishedAssignments: PropTypes.arrayOf(
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
};
