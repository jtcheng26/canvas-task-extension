import React from 'react';
import styled from 'styled-components';
import Task from './Task';
import PropTypes from 'prop-types';
import Subtitle from './Subtitle';

const ListContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5px 0px 10px 0px;
  overflow-y: auto;
  max-height: 450px;
  padding: 0px 5px;
  padding-bottom: 5px;
`;

/*
 *Const demoAssignment = {
 *  name: 'Demo Assignment',
 *  html_url: 'https://hcpss.instructure.com/',
 *  points_possible: '15.0',
 *  due_at: '2020-11-09T08:30:00-05:00',
 *  color: '#D41E00',
 *  course_name: 'Course Name',
 *  course_id: 12345,
 *};
 */

export default function TaskList({ assignments, course_id }) {
  assignments = assignments.filter((assignment) => {
    return assignment.submission.attempt === null;
  });
  const containerStyle = {
    height: `${Math.max(50, Math.min(25 + assignments.length * 85, 450))}px`,
    marginBottom: '10px',
  };
  if (course_id != -1) {
    assignments = assignments.filter((assignment) => {
      return assignment.course_id == course_id;
    });
  }
  return (
    <div style={containerStyle}>
      <Subtitle />
      <ListContainer>
        {assignments.length > 0
          ? assignments.map((assignment) => {
              return <Task assignment={assignment} key={assignment.id} />;
            })
          : 'None'}
      </ListContainer>
    </div>
  );
}

TaskList.defaultProps = {
  course_id: -1,
};

TaskList.propTypes = {
  assignments: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string,
      html_url: PropTypes.string,
      name: PropTypes.string,
      points_possible: PropTypes.number,
      due_at: PropTypes.string,
      course_id: PropTypes.number,
      submission: PropTypes.shape({
        attempt: PropTypes.number,
      }),
    })
  ).isRequired,
  course_id: PropTypes.number,
};
