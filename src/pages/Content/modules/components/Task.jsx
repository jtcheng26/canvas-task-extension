import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const TaskContainer = styled.div`
    width: 100%;
    height: 70px;
    margin: 5px;
    background-color: #ffffff;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    font-weight: bold;
    font-size: 12px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    &:hover {
      a {
        text-decoration: underline;
      }
      cursor: pointer;
      box-shadow: 0 4px 7px rgba(0, 0, 0, 0.3);
    }
  `,
  TaskBottom = styled.div`
    box-sizing: border-box;
    width: 100%;
    height: 35px;
    border-radius: 0px 0px 4px 4px;
    padding-left: 15px;
    padding-top: 5px;
    color: var(--ic-brand-font-color-dark-lightened-30);
  `,
  TaskLink = styled.a`
    color: #ffffff;
    overflow-x: auto;
    &:hover {
      color: #ffffff;
    }
  `;

export default function Task({ assignment }) {
  /* Demo Task */
  const due_at = new Date(assignment.due_at),
    due_date = due_at.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    due_time = due_at.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }),
    TaskTopStyle = {
      boxSizing: 'border-box',
      width: '100%',
      height: '35px',
      borderRadius: '4px 4px 0px 0px',
      paddingLeft: '15px',
      paddingTop: '15px',
      backgroundColor: assignment.color,
    };
  function onClick(e) {
    e.preventDefault();
    window.location.href = assignment.html_url;
  }
  return (
    <TaskContainer onClick={onClick}>
      <div className="task-top" style={TaskTopStyle}>
        <TaskLink href={assignment.html_url}>{assignment.name}</TaskLink>
      </div>
      <TaskBottom>
        {`${parseFloat(
          assignment.points_possible
        )} points \xa0|\xa0 ${due_date} at ${due_time}`}
      </TaskBottom>
    </TaskContainer>
  );
}

TaskBottom.displayName = 'TaskBottom';
TaskLink.displayName = 'TaskLink';

Task.propTypes = {
  assignment: PropTypes.shape({
    color: PropTypes.string,
    html_url: PropTypes.string,
    name: PropTypes.string,
    points_possible: PropTypes.number,
    due_at: PropTypes.string,
    course_id: PropTypes.number,
    id: PropTypes.number,
    user_submitted: PropTypes.bool,
  }).isRequired,
};
