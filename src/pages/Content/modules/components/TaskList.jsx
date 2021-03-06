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

const ListWrapper = styled.div`
  height: ${(props) => props.height}px;
  margin: 10px 0px 25px 0px;
`;

const ViewMore = styled.a`
  font-size: 0.9rem;
`;

/*
  Renders all unfinished assignments
*/

export default function TaskList({ assignments, selectedCourseId }) {
  const [viewingMore, setViewingMore] = useState(false);
  const height = !viewingMore
    ? 25 + Math.min(assignments.length, 4) * 80
    : 25 + assignments.length * 80;
  if (selectedCourseId !== -1) {
    assignments = assignments.filter((assignment) => {
      return assignment.course_id === selectedCourseId;
    });
  }
  let viewMoreText = 'View less';
  let renderedAssignments = assignments;
  if (!viewingMore) {
    renderedAssignments = assignments.slice(0, Math.min(4, assignments.length));
    viewMoreText = `View ${assignments.length - 4} more`;
  }
  function onClick(event) {
    event.preventDefault();
    setViewingMore(!viewingMore);
  }
  return (
    <ListWrapper height={height}>
      <Subtitle text="Unfinished" />
      <ListContainer>
        {renderedAssignments.length > 0
          ? renderedAssignments.map((assignment) => {
              return <Task assignment={assignment} key={assignment.id} />;
            })
          : 'None'}
      </ListContainer>
      {assignments.length > 4 && (
        <ViewMore href="#" onClick={onClick}>
          {viewMoreText}
        </ViewMore>
      )}
    </ListWrapper>
  );
}

TaskList.defaultProps = {
  selectedCourseId: -1,
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
      user_submitted: PropTypes.bool,
      is_quiz_assignment: PropTypes.bool,
      course_code: PropTypes.string,
      grade: PropTypes.number,
    })
  ).isRequired,
  selectedCourseId: PropTypes.number,
};
