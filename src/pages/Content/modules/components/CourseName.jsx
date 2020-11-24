import React from 'react';
import PropTypes from 'prop-types';

export default function CourseName({ courseCode, color }) {
  const courseTitle = {
    paddingTop: '5px',
    paddingBottom: '5px',
    height: '15px',
    color: courseCode == '-1' ? 'black' : color,
    fontFamily: 'Lato Extended',
    fontWeight: 'bold',
    fontSize: '14px',
    lineHeight: '1.2',
    textAlign: 'center',
  };
  return (
    <div style={courseTitle}>
      {courseCode == '-1' ? 'All Courses' : courseCode}
    </div>
  );
}

CourseName.defaultProps = {
  color: 'black',
  courseCode: '-1',
};

CourseName.propTypes = {
  color: PropTypes.string,
  courseCode: PropTypes.string,
};
