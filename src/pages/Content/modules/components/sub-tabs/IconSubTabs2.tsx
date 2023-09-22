import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { DarkProps } from '../../types/props';
import { TaskTypeTab } from '../task-list/utils/useHeadings';
import { ASSIGNMENT_ICON, THEME_COLOR } from '../../constants';
import { AnnouncementIcon, CheckIcon } from '../../icons';
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
  padding-bottom: 5px;
  border-bottom: 1px solid
    ${(props) =>
      props.dark
        ? 'var(--tfc-dark-mode-text-secondary)'
        : 'rgb(199, 205, 209)'};
`;

interface SubtitleTabProps {
  active?: boolean;
  iconClassname: string;
  opacity: number;
  color?: string;
}
const SubtitleTab = styled.div<SubtitleTabProps & DarkProps>`
  color: ${(props) => props.color};
  .${(props) => props.iconClassname} {
    transition: 0.2s ease-in-out;
    opacity: ${(props) => props.opacity};
  }
  &:hover {
    .${(props) => props.iconClassname} {
      ${(props) => (props.active ? '' : 'opacity: 1;')}
      ${(props) => (props.active ? '' : 'fill: ' + props.color + ';')}
    }
    ${(props) => (props.active ? '' : 'cursor: pointer;')}
  }
  font-size: 14px;
  font-weight: ${(p) => (p.active ? 'bold' : 'normal')};
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 5px;
  align-items: center;
`;

interface ColorProps {
  color?: string;
  visible: boolean;
}

const InactiveTabs = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 10px;
`;

export interface SubTabsProps {
  dark?: boolean;
  setTaskListState?: (state: TaskTypeTab) => void;
  taskListState?: TaskTypeTab;
}

/*
  Renders a subtitle within the app
*/
export default function IconSubTabs2({
  dark,
  setTaskListState,
  taskListState,
}: SubTabsProps): JSX.Element {
  const [dropdown, setDropdown] = useState(false);
  function toggleDropdown() {
    setDropdown(!dropdown);
  }
  function setTaskListStateFunc(state: TaskTypeTab) {
    return () => {
      if (setTaskListState) setTaskListState(state);
    };
  }

  const activeClassname = {
    Announcements: 'tfc-announcement-tab',
    Unfinished: 'tfc-todo-tab',
    Completed: 'tfc-completed-tab',
  };

  const { data: options } = useOptions();

  const iconColor = options?.theme_color; // dark
  // ? 'var(--tfc-dark-mode-text-primary)'
  // : 'var(--ic-brand-font-color-dark)';

  const activeIcon = {
    Announcements: (
      <AnnouncementIconComponent color={iconColor} flat variant="solid" />
    ),
    Unfinished: (
      <AssignmentIconComponent color={iconColor} flat variant="solid" />
    ),
    Completed: <CompletedIconComponent color={iconColor} />,
  };

  const inactiveIconOrder: TaskTypeTab[] = useMemo(
    () =>
      Object.keys(activeIcon)
        .filter((x) => x !== taskListState)
        .map((x) => x as TaskTypeTab),
    [taskListState]
  );

  const inactiveIcon = {
    Announcements: (
      <AnnouncementIconComponent color="#6c757c" flat variant="outline" />
    ),
    Unfinished: (
      <AssignmentIconComponent color="#6c757c" flat variant="outline" />
    ),
    Completed: <CompletedIconComponent color="#6c757c" />,
  };

  return (
    <div>
      <SubtitleDiv dark={dark} onClick={toggleDropdown}>
        <SubtitleTab
          active
          color={options?.theme_color}
          dark={dark}
          iconClassname={activeClassname[taskListState ?? 'Unfinished']}
          opacity={1}
        >
          {activeIcon[taskListState ?? 'Unfinished']}
          {taskListState}
        </SubtitleTab>
        <InactiveTabs>
          {inactiveIconOrder.map((state) => (
            <SubtitleTab
              active={false}
              color="#6c757c"
              dark={dark}
              iconClassname={activeClassname[state ?? 'Unfinished']}
              key={state}
              onClick={setTaskListStateFunc(state)}
              opacity={0.5}
            >
              {inactiveIcon[state ?? 'Unfinished']}
            </SubtitleTab>
          ))}
        </InactiveTabs>
      </SubtitleDiv>
      {/* <BottomLine dark={dark}>
        <BorderBottom
          color={options?.theme_color}
          visible={taskListState === 'Announcements'}
        />
        <BorderBottom
          color={options?.theme_color}
          visible={taskListState === 'Unfinished'}
        />

        <BorderBottom
          color={options?.theme_color}
          visible={taskListState === 'Completed'}
        />
      </BottomLine> */}
    </div>
  );
}
