import React, { useContext } from 'react';
import styled from 'styled-components';
import { AssignmentType } from '../../types';
import { AssignmentDefaults, ASSIGNMENT_ICON } from '../../constants';
import { CheckIcon } from '../../icons';
import fmtDate from './utils/fmtDate';
import { DarkProps } from '../../types/props';
import { DarkContext } from '../../contexts/darkContext';

export interface AnimatedProps {
  static?: boolean;
  opacity?: number;
  height?: number;
}

export const TaskContainer = styled.div.attrs(
    (props: AnimatedProps & DarkProps) => ({
      style: {
        height: props.height ? props.height : 0,
        margin: props.opacity ? 5 * props.opacity : 0,
        opacity: props.opacity ? props.opacity : 0,
      },
    })
  )<AnimatedProps & DarkProps>`
    width: 100%;
    background-color: ${(props) =>
      props.dark ? 'var(--tfc-dark-mode-bg-primary)' : 'inherit'};
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

    transition: box-shadow 0.2s;
  `,
  TaskInfo = styled.div<DarkProps>`
    display: flex;
    flex-direction: column;
    padding: 0px 6px 8px 6px;
    box-sizing: border-box;
    width: 100%;
    font-size: 11px;
    color: ${(props) =>
      props.dark ? 'var(--tfc-dark-mode-text-secondary)' : '#4c5860'};
    overflow-x: auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  TaskLink = styled.a<DarkProps>`
    color: ${(props) =>
      props.dark
        ? 'var(--tfc-dark-mode-text-primary)'
        : 'var(--ic-brand-font-color-dark)'};
    font-weight: 700;
    font-size: 15px;
    &:hover {
      color: ${(props) =>
        props.dark
          ? 'var(--tfc-dark-mode-text-primary)'
          : 'var(--ic-brand-font-color-dark)'};
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
  SkeletonTitle = styled.div<AnimatedProps & DarkProps>`
    width: 90%;
    height: 12px;
    background-color: ${(props) => (!props.dark ? '#e8e8e8' : '#3f3f46')};
    border-radius: 100px;
    margin: 2px 0px;
    animation: ${(props) =>
      props.static ? 'none' : 'canvas-tasks-skeleton-pulse 1s infinite'};
  `,
  SkeletonInfo = styled.div<AnimatedProps & DarkProps>`
    width: 75%;
    height: 12px;
    background-color: ${(props) => (!props.dark ? '#e8e8e8' : '#3f3f46')};
    border-radius: 100px;
    margin: 2px 0px;
    animation: ${(props) =>
      props.static
        ? 'none'
        : 'canvas-tasks-skeleton-pulse 1s 0.5s infinite linear both'};
  `,
  SkeletonCourseCode = styled.div<AnimatedProps & DarkProps>`
    width: 50%;
    height: 12px;
    background-color: ${(props) => (!props.dark ? '#e8e8e8' : '#3f3f46')};
    border-radius: 100px;
    margin: 2px 0px;
    margin-top: 6px;
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
  needs_grading_count?: number;
  markComplete?: () => void;
  markDeleted?: () => void;
  skeleton?: boolean;
  transitionState?: TransitionState;
}

export interface TransitionState {
  opacity: number;
  height: number;
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
  needs_grading_count,
  markComplete,
  markDeleted,
  skeleton,
  transitionState,
}: TaskProps): JSX.Element {
  const [due_date, due_time] = fmtDate(due_at);
  const [graded_date, graded_time] = fmtDate(
    graded_at ? graded_at : new Date().toISOString()
  );
  function onClick(e: React.MouseEvent<HTMLInputElement>) {
    e.preventDefault();
    window.location.href = html_url;
  }
  const icon = ASSIGNMENT_ICON[needs_grading_count ? 'ungraded' : type];

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
  const needsGradingText = needs_grading_count
    ? `${needs_grading_count} ungraded`
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
  const darkMode = useContext(DarkContext);
  return (
    <TaskContainer
      dark={darkMode}
      height={transitionState ? transitionState?.height : 65}
      opacity={transitionState ? transitionState?.opacity : 1}
    >
      <TaskLeft
        color={
          (!skeleton ? color : darkMode ? '#3f3f46' : '#e8e8e8') || '000000'
        }
        onClick={onClick}
      >
        {!skeleton && (transitionState ? transitionState?.height >= 40 : true)
          ? icon
          : ''}
      </TaskLeft>
      <TaskInfo dark={darkMode}>
        <TaskTop>
          <CourseCodeText color={color}>
            {!skeleton ? course_name : <SkeletonCourseCode dark={darkMode} />}
          </CourseCodeText>
          {!skeleton && !needs_grading_count ? ( // assignments that need grading should not be marked manually
            <CheckIcon
              checkStyle={complete ? 'Revert' : 'Check'}
              dark={darkMode}
              onClick={markAssignmentAsComplete}
            />
          ) : (
            ''
          )}
          {!skeleton && complete && type === AssignmentType.NOTE ? (
            <CheckIcon
              checkStyle="X"
              dark={darkMode}
              onClick={markAssignmentAsDeleted}
            />
          ) : (
            ''
          )}
        </TaskTop>
        <TaskLink dark={darkMode} href={html_url}>
          {!skeleton ? name : <SkeletonTitle dark={darkMode} />}
        </TaskLink>
        <TaskDetailsText>
          {skeleton ? (
            <SkeletonInfo dark={darkMode} />
          ) : !complete || needs_grading_count ? (
            <>
              <strong>{due}</strong>
              {dueText}
              {needs_grading_count ? (
                <strong>
                  {' \xa0|\xa0 '}
                  <span style={{ color: color }}>{needsGradingText}</span>
                </strong>
              ) : (
                pointsText
              )}
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
