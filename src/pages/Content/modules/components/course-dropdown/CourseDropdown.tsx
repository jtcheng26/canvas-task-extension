import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Course } from '../../types';
import CourseButton from '../course-button';

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

const Dropdown = styled.div`
  position: absolute;
  z-index: 20;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  background-color: white;
  border-radius: 0px 0px 4px 4px;
  width: 100%;
`;

const CourseDropdownContainer = styled.div`
  position: relative;
`;

export interface CourseDropdownProps {
  courses: Course[];
  selectedCourseId?: number;
  setCourse: (id: number) => void;
  onCoursePage: boolean;
}

/*
  Renders the current filtered course and dropdown menu to change the current course
*/
export default function CourseDropdown({
  courses,
  selectedCourseId = -1,
  setCourse,
  onCoursePage = false,
}: CourseDropdownProps): JSX.Element {
  const [menuVisible, setMenuVisible] = useState(false);

  const courseMap = useMemo(() => {
    const map: Record<number, Course> = {};
    courses.forEach((course) => {
      map[course.id] = course;
    });
    return map;
  }, [courses]);

  const name =
    selectedCourseId != -1 ? courseMap[selectedCourseId].name : 'All Courses';
  const color =
    selectedCourseId != -1
      ? courseMap[selectedCourseId].color
      : 'var(--ic-brand-font-color-dark)';

  function toggleMenu() {
    setMenuVisible(!menuVisible);
  }
  return (
    <CourseDropdownContainer>
      <CourseTitle color={color} onClick={toggleMenu}>
        {name}
        <SelectArrow menuVisible={menuVisible} />
      </CourseTitle>
      <Dropdown>
        {!onCoursePage && selectedCourseId != -1 && (
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
        {onCoursePage && selectedCourseId != -1 ? (
          <CourseButton
            color={courseMap[selectedCourseId].color}
            id={selectedCourseId}
            last
            menuVisible={menuVisible}
            name={courseMap[selectedCourseId].name}
            setCourse={setCourse}
            setMenuVisible={setMenuVisible}
          />
        ) : (
          courses.map((course, i) => (
            <CourseButton
              color={course.color}
              id={course.id}
              key={`course-btn-${course}`}
              last={i === courses.length - 1}
              menuVisible={menuVisible}
              name={course.name}
              setCourse={setCourse}
              setMenuVisible={setMenuVisible}
            />
          ))
        )}
      </Dropdown>
    </CourseDropdownContainer>
  );
}
