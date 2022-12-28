import React from 'react';
import styled from 'styled-components';
import { AssignmentType } from '../../types';
import { AssignmentDefaults, ASSIGNMENT_ICON } from '../../constants';
import { CheckIcon } from '../../icons';
import fmtDate from './utils/fmtDate';

interface AnimatedProps {
  static?: boolean;
}

export const TaskContainer = styled.div`
    width: 100%;
    height: 65px;
    margin: 5px;
    background-color: inherit;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    font-size: 12px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    &:hover {
      box-shadow: 0 4px 7px rgba(0, 0, 0, 0.3);
    }
    @keyframes canvas-tasks-skeleton-pulse {
      50% {
        opacity: 0.5;
      }
      100% {
        opacity: 1;
      }
    }
  `,
  TaskInfo = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0px 6px 8px 6px;
    box-sizing: border-box;
    width: 100%;
    font-size: 11px;
    color: #4c5860;
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
    width: 100%;
  `,
  TaskTop = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,
  TaskDetailsText = styled.div`
    overflow-x: auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  SkeletonTitle = styled.div<AnimatedProps>`
    width: 90%;
    height: 12px;
    background-color: #e8e8e8;
    margin: 3px 0px;
    animation: ${(props) =>
      props.static ? 'none' : 'canvas-tasks-skeleton-pulse 1s infinite'};
  `,
  SkeletonInfo = styled.div<AnimatedProps>`
    width: 75%;
    height: 12px;
    background-color: #e8e8e8;
    margin: 2px 0px;
    animation: ${(props) =>
      props.static
        ? 'none'
        : 'canvas-tasks-skeleton-pulse 1s 0.5s infinite linear both'};
  `,
  SkeletonCourseCode = styled.div<AnimatedProps>`
    width: 50%;
    height: 12px;
    background-color: #e8e8e8;
    margin: 2px 0px;
    animation: ${(props) =>
      props.static
        ? 'none'
        : 'canvas-tasks-skeleton-pulse 1s 0.5s infinite linear both'};
  `;
interface TaskProps {
  name?: string;
  type?: AssignmentType;
  html_url?: string;
  due_at?: string;
  points_possible?: number;
  complete?: boolean;
  submitted?: boolean;
  graded_at?: string;
  color?: string;
  graded?: boolean;
  course_name?: string;
  markComplete?: () => void;
  markDeleted?: () => void;
  skeleton?: boolean;
}
/*
    Renders an individual task item
*/

export default function TaskCard({
  name = AssignmentDefaults.name,
  type = AssignmentDefaults.type,
  html_url = AssignmentDefaults.html_url,
  due_at = AssignmentDefaults.due_at,
  points_possible,
  course_name,
  complete = AssignmentDefaults.marked_complete,
  graded,
  graded_at,
  color,
  submitted,
  markComplete,
  markDeleted,
  skeleton,
}: TaskProps): JSX.Element {
  const [due_date, due_time] = fmtDate(due_at);
  const [graded_date, graded_time] = fmtDate(
    graded_at ? graded_at : new Date().toISOString()
  );
  function onClick(e: React.MouseEvent<HTMLInputElement>) {
    e.preventDefault();
    window.location.href = html_url;
  }
  const icon = ASSIGNMENT_ICON[type];

  const due = 'Due';
  const submittedText =
    !submitted && complete ? 'Unsubmitted' : points_possible ? 'Submitted' : '';
  const dueText = ` ${due_date} at ${due_time}`;
  const gradedAtText =
    !graded || !graded_at ? '' : ` ${graded_date} at ${graded_time}`;
  const pointsPlural = !points_possible
    ? ''
    : points_possible > 1
    ? 'points'
    : 'point';
  const pointsText = points_possible
    ? ` \xa0|\xa0 ${points_possible} ${pointsPlural}`
    : '';
  const gradedText = points_possible
    ? ` ${!graded ? ' Waiting for grade' : ' Graded'}`
    : ' Completed';
  function markAssignmentAsComplete() {
    if (markComplete) {
      markComplete();
    }
  }
  function markAssignmentAsDeleted() {
    if (markDeleted) {
      markDeleted();
    }
  }
  return (
    <TaskContainer>
      <TaskLeft
        color={(!skeleton ? color : '#e8e8e8') || '000000'}
        onClick={onClick}
      >
        {!skeleton ? icon : ''}
      </TaskLeft>
      <TaskInfo>
        <TaskTop>
          <CourseCodeText color={color}>
            {!skeleton ? course_name : <SkeletonCourseCode />}
          </CourseCodeText>
          {!skeleton ? (
            <CheckIcon
              checkStyle={complete ? 'Revert' : 'Check'}
              onClick={markAssignmentAsComplete}
            />
          ) : (
            ''
          )}
          {!skeleton && complete && type === AssignmentType.NOTE ? (
            <CheckIcon checkStyle="X" onClick={markAssignmentAsDeleted} />
          ) : (
            ''
          )}
        </TaskTop>
        <TaskLink href={html_url}>
          {!skeleton ? name : <SkeletonTitle />}
        </TaskLink>
        <TaskDetailsText>
          {skeleton ? (
            <SkeletonInfo />
          ) : !complete ? (
            <>
              <strong>{due}</strong>
              {dueText + pointsText}
            </>
          ) : (
            <>
              {!graded && points_possible ? (
                <>
                  <strong>{submittedText}</strong>
                  {' \xa0|\xa0 '}
                </>
              ) : (
                ''
              )}
              <strong>{gradedText}</strong>
              {gradedAtText}
            </>
          )}
        </TaskDetailsText>
      </TaskInfo>
    </TaskContainer>
  );
}

TaskLink.displayName = 'TaskLink';
