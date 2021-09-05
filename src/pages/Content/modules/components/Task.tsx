import React from 'react';
import styled from 'styled-components';
import { Assignment } from '../types';
import { AssignmentIcon, DiscussionIcon, QuizIcon } from '../icons';

const TaskContainer = styled.div`
    width: 100%;
    height: 65px;
    margin: 5px;
    background-color: #ffffff;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    font-size: 12px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    &:hover {
      box-shadow: 0 4px 7px rgba(0, 0, 0, 0.3);
    }
  `,
  TaskInfo = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0px 6px 8px 6px;
    box-sizing: border-box;
    width: 100%;
    font-size: 11px;
    color: var(--ic-brand-font-color-dark-lightened-15);
    overflow-x: auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  TaskLink = styled.a`
    color: var(--ic-brand-font-color-dark);
    font-weight: 700;
    font-size: 15px;
    &:hover {
      color: var(--ic-brand-font-color-dark);
    }
    overflow-x: auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  TaskLeft = styled.div`
    width: 40px;
    height: 100%;
    border-radius: 4px 0px 0px 4px;
    background-color: ${(props) => props.color};
    padding: 6px;
    padding-bottom: 8px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      cursor: pointer;
    }
  `,
  CourseCodeText = styled.div`
    color: ${(props) => props.color};
    font-weight: 700;
    margin-top: 4px;
    overflow-x: auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  TaskDetailsText = styled.div`
    overflow-x: auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `;

interface TaskProps {
  assignment: Assignment;
  name: string;
  color: string;
}
/*
    Renders an individual task item
*/

export default function Task({
  assignment,
  name,
  color,
}: TaskProps): JSX.Element {
  const due_at = new Date(assignment.due_at),
    due_date = due_at.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    due_time = due_at.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  function onClick(e: React.MouseEvent<HTMLInputElement>) {
    e.preventDefault();
    window.location.href = assignment.html_url;
  }
  const icon = {
    assignment: AssignmentIcon,
    quiz: QuizIcon,
    discussion: DiscussionIcon,
  };
  let assignmentIcon = icon.assignment;
  if (assignment.is_quiz_assignment || assignment.is_quiz_lti_assignment) {
    assignmentIcon = icon.quiz;
  } else if ('discussion_topic' in assignment) {
    assignmentIcon = icon.discussion;
  }
  const due = 'Due';
  const DueLabel = <strong>{due}</strong>;
  return (
    <TaskContainer>
      <TaskLeft color={color || '000000'} onClick={onClick}>
        {assignmentIcon}
      </TaskLeft>
      <TaskInfo>
        <CourseCodeText color={assignment.color}>{name}</CourseCodeText>
        <TaskLink href={assignment.html_url}>{assignment.name}</TaskLink>
        <TaskDetailsText>
          {DueLabel}
          {` ${due_date} at ${due_time}` +
            (!isNaN(assignment.points_possible) &&
            assignment.points_possible !== undefined &&
            assignment.points_possible !== null
              ? ` \xa0|\xa0 ${assignment.points_possible} point${
                  assignment.points_possible != 1 ? 's' : ''
                }`
              : '')}
        </TaskDetailsText>
      </TaskInfo>
    </TaskContainer>
  );
}

TaskLink.displayName = 'TaskLink';
