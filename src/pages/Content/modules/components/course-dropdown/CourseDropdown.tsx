import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { CourseStoreContext, DarkContext } from '../../contexts/contexts';
import { Direction } from '../../types';
import ArrowButton from '../arrow-button/ArrowButton';
import CourseButton from '../course-button';
import TextInput from '../task-form/components/TextInput';
import { DarkProps } from '../../types/props';
import { CourseStoreInterface } from '../../hooks/useCourseStore';

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

export interface DropdownChoice {
  id: string;
  name: string;
  color: string;
}

export interface CourseDropdownProps {
  choices: DropdownChoice[];
  defaultColor?: string;
  selectedId?: string;
  setChoice: (id: string) => void;
  onCoursePage: boolean;
  maxHeight?: number;
  zIndex?: number;
  defaultOption?: string;
  noDefault?: boolean;
  instructureStyle?: boolean;
}

export function coursesToChoices(
  courses: string[],
  store: CourseStoreInterface
): DropdownChoice[] {
  return courses.map((id) => ({
    id: id,
    name: store.state[id].name,
    color: store.state[id].color,
  }));
}

/*
  Renders the current filtered course and dropdown menu to change the current course
*/
export default function CourseDropdown({
  choices,
  defaultOption,
  defaultColor,
  noDefault,
  maxHeight,
  zIndex,
  instructureStyle,
  selectedId = '',
  setChoice,
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

  const selectedChoice = selectedId
    ? choices.filter((choice) => choice.id == selectedId)[0]
    : choices[0];

  const name = selectedId
    ? selectedChoice.name
    : defaultOption
    ? defaultOption
    : 'All Courses';
  const color = selectedId
    ? selectedChoice.color
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
        {!noDefault && !onCoursePage && selectedId && (
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
            setCourse={setChoice}
            setMenuVisible={setMenuVisible}
          />
        )}
        {onCoursePage && selectedId ? (
          <CourseButton
            color={selectedChoice.color}
            id={selectedId}
            last
            menuVisible={menuVisible}
            name={selectedChoice.name}
            setCourse={setChoice}
            setMenuVisible={setMenuVisible}
          />
        ) : (
          choices.map((choice, i) => (
            <CourseButton
              color={choice.color}
              id={choice.id}
              key={`course-btn-${choice.id}`}
              last={i === choices.length - 1}
              menuVisible={menuVisible}
              name={choice.name}
              setCourse={setChoice}
              setMenuVisible={setMenuVisible}
            />
          ))
        )}
      </Dropdown>
    </CourseDropdownContainer>
  );
}
