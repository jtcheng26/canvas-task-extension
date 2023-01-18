import React, { useState } from 'react';
import styled from 'styled-components';
import { TaskLeft, TaskLink } from './TaskCard';
import PlusIcon from '../../icons/plus';
import { FinalAssignment } from '../../types';
import TaskForm from '../task-form/TaskForm';

export const TaskContainer = styled.div`
  width: 100%;
  height: 36px;
  margin: 10px 0px 5px 0px;
  background-color: inherit;
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 12px;
  background-color: rgba(220, 220, 220, 0.4);
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
  onSubmit?: (assignment: FinalAssignment) => void;
  selectedCourse?: string;
}

export default function CreateTaskCard({
  onSubmit,
  selectedCourse,
}: TaskProps): JSX.Element {
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
      <TaskContainer onClick={onClick}>
        <TaskLeft color="#d8d8d8" onClick={onClick}>
          {PlusIcon}
        </TaskLeft>
        <TaskInfo>
          <TaskTitle>{text}</TaskTitle>
        </TaskInfo>
      </TaskContainer>
      {formVisible && (
        <TaskForm
          close={closeForm}
          onSubmit={onSubmit}
          selectedCourse={selectedCourse}
          visible={formVisible}
        />
      )}
    </>
  );
}

TaskLink.displayName = 'TaskLink';
