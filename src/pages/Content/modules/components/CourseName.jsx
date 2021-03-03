import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import CourseButton from './CourseButton';

const SelectArrow = styled.div`
  margin: 0px 0px 0px 4px;
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-top: 7px solid rgba(0, 0, 0, 40%);
  border-right: 4px solid transparent;
  background: transparent;
  transform: rotate(${(props) => (props.menuVisible ? '180deg' : '0deg')});
`;

const CourseTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  padding: 8px 10px;
  height: 15px;
  color: ${(props) =>
    props.courseSelection === -1
      ? 'var(--ic-brand-font-color-dark)'
      : props.courseSelection.color};
  font-family: Lato Extended;
  font-weight: bold;
  font-size: 14px;
  line-height: 1.2;
  position: relative;
  border-bottom: 1px solid #eeeeee;
  &:hover {
    cursor: pointer;
    div {
      border-top: 7px solid rgba(0, 0, 0, 75%);
    }
  }
  z-index: 20;
  height: auto;
`;

const CourseDropdown = styled.div`
  position: absolute;
  z-index: 20;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  background: white;
  border-radius: 0px 0px 4px 4px;
  width: 100%;
  .course-btn {
    border-bottom: 1px solid #eeeeee;
    font-family: Lato Extended;
    font-weight: bold;
    font-size: 14px;
    line-height: 1.4;
    position: relative;
    padding: 8px;
    background: white;
    z-index: 20;
    &:hover {
      cursor: pointer;
      background: #eeeeee;
    }
  }
  .course-btn-last {
    border-radius: 0px 0px 4px 4px;
    border-bottom: none;
  }
`;

const CourseNameContainer = styled.div`
  position: relative;
`;

/*
  Renders the current filtered course and dropdown menu to change the current course
*/

export default function CourseName({
  courses,
  selectedCourseId,
  setCourse,
  onCoursePage,
}) {
  const [menuVisible, setMenuVisible] = useState(false);
  let courseSelection = courses.filter((course) => {
    return course.id === selectedCourseId;
  });
  courseSelection = courseSelection.length === 0 ? -1 : courseSelection[0];
  function toggleMenu() {
    setMenuVisible(!menuVisible);
  }
  return (
    <CourseNameContainer>
      <CourseTitle courseSelection={courseSelection} onClick={toggleMenu}>
        {courseSelection === -1 ? 'All Courses' : courseSelection.name}
        <SelectArrow menuVisible={menuVisible} />
      </CourseTitle>
      <CourseDropdown menuVisible={menuVisible}>
        {!onCoursePage && courseSelection !== -1 && (
          <CourseButton
            color="black"
            id={-1}
            menuVisible={menuVisible}
            name="All Courses"
            setCourse={setCourse}
            setMenuVisible={setMenuVisible}
          />
        )}
        {courses.map((course, i) => (
          <CourseButton
            color={course.color}
            id={course.id}
            key={`course-btn-${course.id}`}
            last={i === courses.length - 1}
            menuVisible={menuVisible}
            name={course.name}
            setCourse={setCourse}
            setMenuVisible={setMenuVisible}
          />
        ))}
      </CourseDropdown>
    </CourseNameContainer>
  );
}

CourseName.defaultProps = {
  onCoursePage: false,
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
  onCoursePage: PropTypes.bool,
  selectedCourseId: PropTypes.number,
  setCourse: PropTypes.func.isRequired,
};
