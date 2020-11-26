import React, { useState } from 'react';
import styled from 'styled-components';
import Task from './Task';
import PropTypes from 'prop-types';
import Subtitle from './Subtitle';

const ListContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5px;
  padding: 0px 5px;
  padding-bottom: 5px;
`;

export default function TaskList({ assignments, course_id }) {
  const [viewingMore, setViewingMore] = useState(false);
  assignments = assignments.filter((assignment) => {
    return assignment.submission.attempt === null;
  });
  const height = !viewingMore
    ? `${25 + Math.min(assignments.length, 4) * 80}px`
    : `${25 + assignments.length * 80}px`;
  const containerStyle = {
    height,
    margin: '10px 0px 25px 0px',
  };
  if (course_id != -1) {
    assignments = assignments.filter((assignment) => {
      return assignment.course_id == course_id;
    });
  }
  let viewMoreText = 'View less';
  let renderedAssignments = assignments;
  if (!viewingMore) {
    renderedAssignments = assignments.slice(0, Math.min(4, assignments.length));
    viewMoreText = `View ${assignments.length - 4} more`;
  }
  function onClick() {
    setViewingMore(!viewingMore);
  }
  return (
    <div style={containerStyle}>
      <Subtitle />
      <ListContainer>
        {renderedAssignments.length > 0
          ? renderedAssignments.map((assignment) => {
              return <Task assignment={assignment} key={assignment.id} />;
            })
          : 'None'}
      </ListContainer>
      {assignments.length > 4 && (
        <a href="#" onClick={onClick} style={{ fontSize: '0.9rem' }}>
          {viewMoreText}
        </a>
      )}
    </div>
  );
}

ListContainer.displayName = 'ListContainer';

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
      id: PropTypes.number,
      submission: PropTypes.shape({
        attempt: PropTypes.number,
      }),
    })
  ).isRequired,
  course_id: PropTypes.number,
};
