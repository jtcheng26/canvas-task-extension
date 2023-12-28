import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { TaskLeft, TaskLink } from './TaskCard';
import PlusIcon from '../../icons/plus';
import { FinalAssignment } from '../../types';
import TaskForm from '../task-form/TaskForm';
import { DarkContext } from '../../contexts/contexts';
import { DarkProps } from '../../types/props';

export const TaskContainer = styled.div<DarkProps>`
  width: 100%;
  height: 36px;
  margin: 10px 0px 5px 0px;
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 12px;
  background-color: ${(props) =>
    props.dark
      ? 'var(--tfc-dark-mode-bg-primary)'
      : 'rgba(220, 220, 220, 0.4)'};
  &:hover {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }
  transition: box-shadow 0.2s;
`;

const TaskInfo = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px 6px 6px 6px;
  box-sizing: border-box;
  width: 100%;
  font-size: 11px;
  color: #4c5860;
  overflow-x: auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TaskTitle = styled.div`
  color: #7c858c;
  font-weight: 700;
  font-size: 15px;
  overflow-x: auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
/*
    Renders an individual task item
*/

interface TaskProps {
  onSubmit?: (assignment: FinalAssignment | FinalAssignment[]) => void;
  selectedCourse?: string;
  grading?: boolean; // whether this show up in the instructor tab
}

export default function CreateTaskCard({
  onSubmit,
  selectedCourse,
  grading = false,
}: TaskProps): JSX.Element {
  const darkMode = useContext(DarkContext);
  const [formVisible, setFormVisible] = useState(false);
  function onClick(e: React.MouseEvent<HTMLInputElement>) {
    e.preventDefault();
    setFormVisible(true);
  }
  function closeForm() {
    setFormVisible(false);
  }

  const text = 'New Task';

  return (
    <>
      <TaskContainer dark={darkMode} onClick={onClick}>
        <TaskLeft
          color={darkMode ? 'var(--tfc-dark-mode-bg-secondary)' : '#d8d8d8'}
          onClick={onClick}
        >
          {PlusIcon}
        </TaskLeft>
        <TaskInfo>
          <TaskTitle>{text}</TaskTitle>
        </TaskInfo>
      </TaskContainer>
      {formVisible && (
        <TaskForm
          close={closeForm}
          grading={grading}
          onSubmit={onSubmit}
          selectedCourse={selectedCourse}
          visible={formVisible}
        />
      )}
    </>
  );
}

TaskLink.displayName = 'TaskLink';
