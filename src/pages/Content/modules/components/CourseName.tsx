import React, { useState } from 'react';
import styled from 'styled-components';
import CourseButton from './CourseButton';
import useCourseNames from '../hooks/useCourseNames';
import useCourseColors from '../hooks/useCourseColors';

interface SelectArrowProps {
  menuVisible: boolean;
}
const SelectArrow = styled.div<SelectArrowProps>`
  margin: 0px 0px 0px 4px;
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-top: 7px solid var(--ic-brand-font-color-dark-lightened-30);
  border-right: 4px solid transparent;
  background: transparent;
  transform: rotate(${(p) => (p.menuVisible ? '180deg' : '0deg')});
`;

interface CourseTitleProps {
  color?: string;
}
const CourseTitle = styled.div<CourseTitleProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  padding: 8px 10px;
  height: 15px;
  color: ${(p) => (!p.color ? 'inherit' : p.color)};
  font-family: Lato Extended;
  font-weight: bold;
  font-size: 14px;
  line-height: 1.2;
  position: relative;
  border-bottom: 1px solid rgba(199, 205, 209, 0.5);
  &:hover {
    cursor: pointer;
    div {
      border-top: 7px solid var(--ic-brand-font-color-dark);
    }
  }
  z-index: 20;
  height: auto;
`;

const CourseDropdown = styled.div`
  position: absolute;
  z-index: 20;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  background-color: inherit;
  border-radius: 0px 0px 4px 4px;
  width: 100%;
  .course-btn {
    border-bottom: 1px solid rgba(199, 205, 209, 0.5);
    font-family: Lato Extended;
    font-weight: bold;
    font-size: 14px;
    line-height: 1.4;
    position: relative;
    padding: 8px;
    background-color: inherit;
    opacity: 100%;
    z-index: 20;
    &:hover {
      cursor: pointer;
      background: rgba(199, 205, 209, 0.5);
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
  courses: number[];
  selectedCourseId?: number;
  setCourse: (id: number) => void;
  onCoursePage: boolean;
}

/*
  Renders the current filtered course and dropdown menu to change the current course
*/
export default function CourseName({
  courses,
  selectedCourseId,
  setCourse,
  onCoursePage = false,
}: CourseNameProps): JSX.Element {
  const [menuVisible, setMenuVisible] = useState(false);
  const courseSelection = selectedCourseId ? selectedCourseId : -1;
  const { data: nameData } = useCourseNames();
  const { data: colorData } = useCourseColors();
  const name =
    nameData && courseSelection ? nameData[courseSelection] : 'All Courses';
  const color =
    colorData && courseSelection
      ? colorData[courseSelection]
      : 'var(--ic-brand-font-color-dark)';
  function toggleMenu() {
    setMenuVisible(!menuVisible);
  }
  return (
    <CourseNameContainer>
      <CourseTitle color={color} onClick={toggleMenu}>
        {courseSelection === -1 ? 'All Courses' : name}
        <SelectArrow menuVisible={menuVisible} />
      </CourseTitle>
      <CourseDropdown>
        {!onCoursePage && courseSelection !== -1 && (
          <CourseButton
            color="var(--ic-brand-font-color-dark)"
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
            color={
              colorData ? colorData[course] : 'var(--ic-brand-font-color-dark)'
            }
            id={course}
            key={`course-btn-${course}`}
            last={i === courses.length - 1}
            menuVisible={menuVisible}
            name={nameData ? nameData[course] : 'Loading'}
            setCourse={setCourse}
            setMenuVisible={setMenuVisible}
          />
        ))}
      </CourseDropdown>
    </CourseNameContainer>
  );
}
