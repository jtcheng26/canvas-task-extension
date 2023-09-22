import React, { useState } from 'react';
import styled from 'styled-components';
import { DarkProps } from '../../types/props';
import { TaskTypeTab } from '../task-list/utils/useHeadings';

const SubtitleDiv = styled.div<DarkProps>`
  border-bottom: 1px solid
    ${(props) =>
      props.dark
        ? 'var(--tfc-dark-mode-text-secondary)'
        : 'rgb(199, 205, 209)'};
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 5px;
`;

interface SubtitleTabProps {
  active?: boolean;
}
const SubtitleTab = styled.div<SubtitleTabProps & DarkProps>`
  color: ${(p) =>
    p.active
      ? p.dark
        ? 'var(--tfc-dark-mode-text-primary)'
        : 'var(--ic-brand-font-color-dark)'
      : '#6c757c'};
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
  font-weight: ${(p) => (p.active ? 'bold' : 'normal')};
`;

export interface SubTabsProps {
  dark?: boolean;
  setTaskListState?: (state: TaskTypeTab) => void;
  taskListState?: TaskTypeTab;
}

/*
  Renders a subtitle within the app
*/
export default function SubTabs({
  dark,
  setTaskListState,
  taskListState,
}: SubTabsProps): JSX.Element {
  const [dropdown, setDropdown] = useState(false);
  function toggleDropdown() {
    setDropdown(!dropdown);
  }
  function setTaskListUnfinished() {
    if (setTaskListState) setTaskListState('Unfinished');
  }
  function setTaskListCompleted() {
    if (setTaskListState) setTaskListState('Completed');
  }
  const unfinishedString = 'Unfinished';
  const finishedString = 'Completed';
  return (
    <SubtitleDiv dark={dark} onClick={toggleDropdown}>
      <SubtitleTab
        active={taskListState === 'Unfinished'}
        dark={dark}
        onClick={setTaskListUnfinished}
      >
        {unfinishedString}
      </SubtitleTab>
      <SubtitleTab
        active={taskListState === 'Completed'}
        dark={dark}
        onClick={setTaskListCompleted}
      >
        {finishedString}
      </SubtitleTab>
    </SubtitleDiv>
  );
}
