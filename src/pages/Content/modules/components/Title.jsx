import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const TitleDiv = styled.div`
  border-bottom: 1px solid #c7cdd1;
  height: 30px;
  font-weight: bold;
  display: inline-block;
`;

export default function Title({ weekStart, weekEnd }) {
  let start = weekStart.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  let end = weekEnd.toLocaleString('en-US', { month: 'short', day: 'numeric' });
  const tasks = "Tasks"
  return (
      <TitleDiv>
          <div style={{ float: 'left' }}>
              {tasks}
          </div>
          <div style={{ float: 'right' }}>
              {`${start} to ${end}`}
          </div>
      </TitleDiv>
  );
}

Title.propTypes = {
  weekEnd: PropTypes.instanceOf(Date).isRequired,
  weekStart: PropTypes.instanceOf(Date).isRequired,
}
