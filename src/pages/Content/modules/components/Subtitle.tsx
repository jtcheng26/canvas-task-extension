import React, { useState } from 'react';
import styled from 'styled-components';
import { TaskListState } from '../types';

const SubtitleDiv = styled.div`
  border-bottom: 1px solid #c7cdd1;
  height: 25px;
  display: flex;
  align-items: center;
  padding-right: 10px;
  padding-bottom: 5px;
  position: relative;
  &:hover {
    cursor: pointer;
    &:nth-child(1) {
      color: black;
    }
    div:nth-of-type(2) {
      border-top: 7px solid var(--ic-brand-font-color-dark) !important;
    }
  }
`;

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

interface DropdownMenuProps {
  open: boolean;
}

const DropdownMenu = styled.div<DropdownMenuProps>`
  position: absolute;
  top: 100%;
  z-index: 20;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  background-color: white;
  border-radius: 0px 0px 4px 4px;
  width: 100%;
  display: ${(props) => (props.open ? 'block' : 'none')};
`;

const DropDownButton = styled.div`
  font-family: Lato Extended;
  padding: 8px;
  background-color: inherit;
  &:hover {
    cursor: pointer;
    background: rgba(199, 205, 209, 0.5);
  }
`;

interface SubtitleProps {
  setTaskListState?: (state: TaskListState) => void;
  taskListState?: TaskListState;
  text: string;
}

/*
  Renders a subtitle within the app
*/
export default function Subtitle({
  setTaskListState,
  taskListState,
  text,
}: SubtitleProps): JSX.Element {
  const [dropdown, setDropdown] = useState(false);
  function toggleDropdown() {
    setDropdown(!dropdown);
  }
  function toggleTaskListState() {
    if (setTaskListState) {
      if (taskListState === 'Unfinished') setTaskListState('Completed');
      else setTaskListState('Unfinished');
    }
  }
  return (
    <SubtitleDiv onClick={toggleDropdown}>
      <div style={{ flexGrow: 1 }}>{text}</div>
      <SelectArrow menuVisible={dropdown} />
      <DropdownMenu open={dropdown}>
        <DropDownButton onClick={toggleTaskListState}>
          {taskListState == 'Unfinished' ? 'Completed' : 'Unfinished'}
        </DropDownButton>
      </DropdownMenu>
    </SubtitleDiv>
  );
}
