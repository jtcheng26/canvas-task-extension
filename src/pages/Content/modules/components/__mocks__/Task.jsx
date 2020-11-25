import React from 'react';
import PropTypes from 'prop-types';
export default function Task({ assignment }) {
  return <div>{assignment.name}</div>;
}

Task.propTypes = {
  assignment: PropTypes.shape({
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
  }).isRequired,
};
