import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import CourseButton from './CourseButton';

const SelectArrow = styled.div`
  position: absolute;
  right: 0px;
  top: 10px;
  margin: 0px 4px;
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-top: 7px solid
    rgba(0, 0, 0, ${(props) => (props.hovering ? '75%' : '40%')});
  border-right: 4px solid transparent;
  background: transparent;
`;

const CourseTitle = styled.div`
  padding-top: 5px;
  padding-bottom: 5px;
  height: 15px;
  color: ${(props) =>
    props.courseSelection === -1
      ? 'var(--ic-brand-font-color-dark)'
      : props.courseSelection.color};
  font-family: Lato Extended;
  font-weight: bold;
  font-size: 14px;
  line-height: 1.2;
  text-align: center;
  position: relative;
  .course-btn {
    position: relative;
    padding: 5px;
    background: white;
    z-index: 20;
    &:hover {
      cursor: pointer;
      background: #eeeeee;
    }
  }
  &:hover {
    cursor: pointer;
  }
`;

const CourseDropdown = styled.div`
  position: relative;
  z-index: 20;
  margin-top: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
`;

export default function CourseName({ courses, selectedCourseId, setCourse }) {
  const [menuVisible, setMenuVisible] = useState(false);
  let courseSelection = courses.filter((course) => {
    return course.id === selectedCourseId;
  });
  courseSelection = courseSelection.length === 0 ? -1 : courseSelection[0];
  function toggleMenu() {
    setMenuVisible(!menuVisible);
  }
  return (
    <CourseTitle courseSelection={courseSelection} onClick={toggleMenu}>
      <div style={{ padding: '0px 10px' }}>
        {courseSelection === -1 ? 'All Courses' : courseSelection.name}
      </div>
      <SelectArrow hovering={menuVisible} />
      <CourseDropdown menuVisible={menuVisible}>
        {courseSelection !== -1 && (
          <CourseButton
            color="black"
            id={-1}
            menuVisible={menuVisible}
            name="All Courses"
            setCourse={setCourse}
            setMenuVisible={setMenuVisible}
          />
        )}
        {courses.map((course) => (
          <CourseButton
            color={course.color}
            id={course.id}
            key={`course-btn-${course.id}`}
            menuVisible={menuVisible}
            name={course.name}
            setCourse={setCourse}
            setMenuVisible={setMenuVisible}
          />
        ))}
      </CourseDropdown>
    </CourseTitle>
  );
}

CourseName.defaultProps = {
  selectedCourseId: -1,
};

CourseName.propTypes = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      color: PropTypes.string,
      name: PropTypes.string,
      position: PropTypes.number,
    })
  ).isRequired,
  selectedCourseId: PropTypes.number,
  setCourse: PropTypes.func.isRequired,
};
