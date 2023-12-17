import React, { useContext, useMemo, useState } from 'react';
import styled from 'styled-components';
import { DarkContext } from '../../contexts/contexts';
import { Course, Direction } from '../../types';
import ArrowButton from '../arrow-button/ArrowButton';
import CourseButton from '../course-button';
import TextInput from '../task-form/components/TextInput';
import { DarkProps } from '../../types/props';

interface CourseTitleProps {
  color?: string;
}
const CourseTitle = styled.div<CourseTitleProps & DarkProps>`
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
  border-bottom: 1px solid
    ${(p) =>
      p.dark ? 'var(--tfc-dark-mode-text-secondary)' : 'rgba(199, 205, 209)'};
  &:hover {
    cursor: pointer;
  }
  z-index: 20;
  height: auto;
`;

interface DropdownProps {
  maxHeight?: number;
  zIndex?: number;
}

const Dropdown = styled.div<DropdownProps & DarkProps>`
  position: absolute;
  z-index: ${(props) => props.zIndex || 20};
  max-height: ${(props) => props.maxHeight + 'px' || 'auto'};
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  background-color: ${(props) =>
    props.dark ? 'var(--tfc-dark-mode-bg-primary-2)' : 'white'};
  border-radius: 0px 0px 4px 4px;
  width: 100%;
`;

const CourseDropdownContainer = styled.div`
  position: relative;
`;

export interface CourseDropdownProps {
  courses: Course[];
  defaultColor?: string;
  selectedCourseId?: string;
  setCourse: (id: string) => void;
  onCoursePage: boolean;
  maxHeight?: number;
  zIndex?: number;
  defaultOption?: string;
  noDefault?: boolean;
  instructureStyle?: boolean;
}

/*
  Renders the current filtered course and dropdown menu to change the current course
*/
export default function CourseDropdown({
  courses,
  defaultOption,
  defaultColor,
  noDefault,
  maxHeight,
  zIndex,
  instructureStyle,
  selectedCourseId = '',
  setCourse,
  onCoursePage = false,
}: CourseDropdownProps): JSX.Element {
  const darkMode = useContext(DarkContext);
  const [menuVisible, setMenuVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  function onHover() {
    setHovering(true);
  }
  function onLeave() {
    setHovering(false);
  }

  const courseMap = useMemo(() => {
    const map: Record<string, Course> = {};
    courses.forEach((course) => {
      map[course.id] = course;
    });
    return map;
  }, [courses]);

  const name =
    selectedCourseId in courseMap
      ? courseMap[selectedCourseId].name
      : defaultOption
      ? defaultOption
      : 'All Courses';
  const color =
    selectedCourseId in courseMap
      ? courseMap[selectedCourseId].color
      : darkMode
      ? 'var(--tfc-dark-mode-text-primary)'
      : 'var(--ic-brand-font-color-dark)';

  function toggleMenu() {
    setMenuVisible(!menuVisible);
  }

  return (
    <CourseDropdownContainer>
      {instructureStyle ? (
        <TextInput
          color={defaultColor}
          dark={darkMode}
          menuVisible={menuVisible}
          onClick={toggleMenu}
          select
          value={name}
        />
      ) : (
        <CourseTitle
          color={color}
          dark={darkMode}
          onClick={toggleMenu}
          onMouseEnter={onHover}
          onMouseLeave={onLeave}
        >
          {name}
          <ArrowButton
            dark={darkMode}
            direction={menuVisible ? Direction.UP : Direction.DOWN}
            hoverIndependent={false}
            hovering={hovering}
          />
        </CourseTitle>
      )}
      <Dropdown dark={darkMode} maxHeight={maxHeight} zIndex={zIndex}>
        {!noDefault && !onCoursePage && selectedCourseId && (
          <CourseButton
            color={
              darkMode
                ? 'var(--tfc-dark-mode-text-primary)'
                : 'var(--ic-brand-font-color-dark)'
            }
            id=""
            last={false}
            menuVisible={menuVisible}
            name={defaultOption || 'All Courses'}
            setCourse={setCourse}
            setMenuVisible={setMenuVisible}
          />
        )}
        {onCoursePage && selectedCourseId ? (
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
              key={`course-btn-${course.id}`}
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
