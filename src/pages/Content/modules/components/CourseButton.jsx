import React from 'react';
import PropTypes from 'prop-types';

/*
  Individual options in course name dropdown
*/

export default function CourseButton({
  name,
  color,
  id,
  last,
  setCourse,
  menuVisible,
  setMenuVisible,
}) {
  function handleClick() {
    setCourse(id);
    setMenuVisible(false);
  }
  return (
    <div
      className={`course-btn${last ? ' course-btn-last' : ''}`}
      onClick={handleClick}
      style={{
        display: menuVisible ? 'block' : 'none',
        color: color,
      }}
    >
      {name}
    </div>
  );
}

CourseButton.defaultProps = {
  color: 'black',
  id: -1,
  last: false,
};

CourseButton.propTypes = {
  color: PropTypes.string,
  id: PropTypes.number,
  last: PropTypes.bool,
  menuVisible: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  setCourse: PropTypes.func.isRequired,
  setMenuVisible: PropTypes.func.isRequired,
};
