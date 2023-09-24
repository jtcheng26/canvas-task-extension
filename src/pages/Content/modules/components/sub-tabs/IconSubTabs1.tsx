import React, { useState } from 'react';
import styled from 'styled-components';
import { DarkProps } from '../../types/props';
import { TaskTypeTab } from '../task-list/utils/useHeadings';
import { AssignmentIconComponent } from '../../icons/assignment';
import useOptions from '../../hooks/useOptions';
import { AnnouncementIconComponent } from '../../icons/announcement';
import { CompletedIconComponent } from '../../icons/completed';
import { ICON_FILL } from '../../icons/constants';

const SubtitleDiv = styled.div<DarkProps>`
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

interface SubtitleTabProps {
  active?: boolean;
  iconClassname: string;
  opacity: number;
  color?: string;
}
const SubtitleTab = styled.div<SubtitleTabProps & DarkProps>`
  color: ${(p) =>
    p.active
      ? p.dark
        ? 'var(--tfc-dark-mode-text-primary)'
        : 'var(--ic-brand-font-color-dark)'
      : '#6c757c'};
  .${(props) => props.iconClassname} {
    transition: 0.2s ease-in-out;
    opacity: ${(props) => props.opacity};
  }
  &:hover {
    .${(props) => props.iconClassname} {
      opacity: 1;
      fill: ${(props) => props.color};
    }
    cursor: pointer;
  }
  font-weight: ${(p) => (p.active ? 'bold' : 'normal')};
  width: 33.33%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

interface ColorProps {
  color?: string;
  visible: boolean;
}

interface AnimatedProps {
  pos: number;
}

const BorderBottom = styled.div<ColorProps & AnimatedProps>`
  height: 3px;
  margin-top: 5px;
  width: 33.33%;
  background-color: ${(props) => (props.color ? props.color : ICON_FILL)};
  border-radius: 100px;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: all 0.2s ease-in-out;
  margin-left: ${(props) => ((100 * props.pos) / 3).toFixed(2)}%;
`;

export interface SubTabsProps {
  dark?: boolean;
  setTaskListState?: (state: TaskTypeTab) => void;
  taskListState?: TaskTypeTab;
  skeleton?: boolean;
  notifs?: number;
}

/*
  Renders a subtitle within the app
*/
export default function IconSubTabs1({
  dark,
  setTaskListState,
  taskListState,
  skeleton = false,
  notifs = 0,
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
  function setTaskListAnnouncements() {
    if (setTaskListState) setTaskListState('Announcements');
  }

  const { data: options } = useOptions();

  const activeColor = skeleton ? '#6c757c' : options?.theme_color;

  const positions = {
    Announcements: 0,
    Unfinished: 1,
    Completed: 2,
  };

  return (
    <div>
      <SubtitleDiv dark={dark} onClick={toggleDropdown}>
        <SubtitleTab
          active={taskListState === 'Announcements'}
          color={activeColor}
          dark={dark}
          iconClassname="tfc-announcement-tab"
          onClick={setTaskListAnnouncements}
          opacity={taskListState === 'Announcements' ? 1 : 0.5}
        >
          <AnnouncementIconComponent
            color={taskListState === 'Announcements' ? activeColor : '#6c757c'}
            flat
            notifs={notifs}
            variant={taskListState === 'Announcements' ? 'solid' : 'outline'}
          />
        </SubtitleTab>
        <SubtitleTab
          active={taskListState === 'Unfinished'}
          color={activeColor}
          dark={dark}
          iconClassname="tfc-todo-tab"
          onClick={setTaskListUnfinished}
          opacity={taskListState === 'Unfinished' ? 1 : 0.5}
        >
          <AssignmentIconComponent
            color={taskListState === 'Unfinished' ? activeColor : '#6c757c'}
            flat
            variant={taskListState === 'Unfinished' ? 'solid' : 'outline'}
          />
        </SubtitleTab>
        <SubtitleTab
          active={taskListState === 'Completed'}
          color={activeColor}
          dark={dark}
          iconClassname="tfc-completed-tab"
          onClick={setTaskListCompleted}
          opacity={taskListState === 'Completed' ? 1 : 0.5}
        >
          <CompletedIconComponent
            color={taskListState === 'Completed' ? activeColor : '#6c757c'}
            variant={taskListState === 'Completed' ? 'solid' : 'outline'}
          />
        </SubtitleTab>
      </SubtitleDiv>
      <BorderBottom
        color={activeColor}
        pos={positions[taskListState ?? 'Unfinished']}
        visible
      />
    </div>
  );
}
