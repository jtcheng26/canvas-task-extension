import React from 'react';
import styled from 'styled-components';

interface StyledButtonProps {
  menuVisible: boolean;
  last: boolean;
  color: string;
}

const StyledButton = styled.div<StyledButtonProps>`
  border-bottom: 1px solid rgba(199, 205, 209, 0.5);
  font-family: Lato;
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
  display: ${(props) => (props.menuVisible ? 'block' : 'none')};
  color: ${(props) => props.color};
  ${(props) =>
    props.last
      ? `
    border-radius: 0px 0px 4px 4px;
    border-bottom: none;
  `
      : ''}
`;

export interface CourseButtonProps {
  name: string;
  color: string;
  id: number;
  last: boolean;
  setCourse: (id: number) => void;
  menuVisible: boolean;
  setMenuVisible: (menuVisible: boolean) => void;
}

/*
  Individual options in course name dropdown
*/
export default function CourseButton({
  name,
  color = 'black',
  id = -1,
  last = false,
  setCourse,
  menuVisible,
  setMenuVisible,
}: CourseButtonProps): JSX.Element {
  function handleClick() {
    setCourse(id);
    setMenuVisible(false);
  }
  return (
    <StyledButton
      color={color}
      last={last}
      menuVisible={menuVisible}
      onClick={handleClick}
    >
      {name}
    </StyledButton>
  );
}