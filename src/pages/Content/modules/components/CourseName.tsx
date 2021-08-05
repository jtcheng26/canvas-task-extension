import React, { useState } from 'react';
import styled from 'styled-components';
import CourseButton from './CourseButton';
import { Course } from '../types';

interface SelectArrowProps {
  menuVisible: boolean;
}
const SelectArrow = styled.div<SelectArrowProps>`
  margin: 0px 0px 0px 4px;
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-top: 7px solid rgba(0, 0, 0, 40%);
  border-right: 4px solid transparent;
  background: transparent;
  transform: rotate(${(p) => (p.menuVisible ? '180deg' : '0deg')});
`;

interface CourseTitleProps {
  courseSelection: Course | -1;
}
const CourseTitle = styled.div<CourseTitleProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  padding: 8px 10px;
  height: 15px;
  color: ${(p) =>
    p.courseSelection === -1
      ? 'var(--ic-brand-font-color-dark)'
      : p.courseSelection.color};
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

interface CourseNameProps {
  courses: Course[];
  selectedCourseId: number;
  setCourse: (id: number) => void;
  onCoursePage: boolean;
}

/*
  Renders the current filtered course and dropdown menu to change the current course
*/
export default function CourseName({
  courses,
  selectedCourseId = -1,
  setCourse,
  onCoursePage = false,
}: CourseNameProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  let courseSelection: -1 | Course[] | Course = courses.filter((course) => {
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
      <CourseDropdown>
        {!onCoursePage && courseSelection !== -1 && (
          <CourseButton
            color="black"
            id={-1}
            last={false}
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
