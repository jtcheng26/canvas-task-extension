import React from 'react';
import styled from 'styled-components';
import { TaskLeft, TaskLink } from './TaskCard';
import PlusIcon from '../../icons/plus';

interface TaskProps {
  onSubmit: (title: string, date: string, course_id: number) => void;
}

export const TaskContainer = styled.div`
  width: 100%;
  height: 36px;
  margin: 10px 5px 5px 15px;
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

export default function CreateTaskCard({ onSubmit }: TaskProps): JSX.Element {
  function onClick(e: React.MouseEvent<HTMLInputElement>) {
    e.preventDefault();
  }

  const text = 'New Task';

  return (
    <TaskContainer onClick={onClick}>
      <TaskLeft color="#d8d8d8" onClick={onClick}>
        {PlusIcon}
      </TaskLeft>
      <TaskInfo>
        <TaskTitle>{text}</TaskTitle>
      </TaskInfo>
    </TaskContainer>
  );
}

TaskLink.displayName = 'TaskLink';
