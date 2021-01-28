import React from 'react';
import PropTypes from 'prop-types';

export default function CourseButton({
  name,
  color,
  id,
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
      className="course-btn"
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
};

CourseButton.propTypes = {
  color: PropTypes.string,
  id: PropTypes.number,
  menuVisible: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  setCourse: PropTypes.func.isRequired,
  setMenuVisible: PropTypes.func.isRequired,
};
