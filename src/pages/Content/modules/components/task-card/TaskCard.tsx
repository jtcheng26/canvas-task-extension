import React, { useContext } from 'react';
import styled from 'styled-components';
import { AssignmentType, FinalAssignment } from '../../types';
import { AssignmentDefaults, ASSIGNMENT_ICON } from '../../constants';
import { CheckIcon } from '../../icons';
import fmtDate, { fmtDateSince } from './utils/fmtDate';
import { DarkProps } from '../../types/props';
import { DarkContext } from '../../contexts/contexts';
import assignmentHasGrade from '../../utils/assignmentHasGrade';

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
  TaskLink = styled.a<DarkProps & AnimatedProps>`
    color: ${(props) =>
      props.dark
        ? 'var(--tfc-dark-mode-text-primary)'
        : 'var(--ic-brand-font-color-dark)'};
    opacity: ${(props) => (props.opacity ? props.opacity : '1')};
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
  TaskDetailsText = styled.div<AnimatedProps>`
    overflow-x: auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    opacity: ${(props) => (props.opacity ? props.opacity : '1')};
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
export interface TaskProps {
  assignment?: FinalAssignment;
  complete?: boolean;
  color?: string;
  course_name?: string;
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
  assignment = AssignmentDefaults,
  complete = AssignmentDefaults.marked_complete,
  course_name,
  color,
  markComplete,
  markDeleted,
  skeleton,
  transitionState,
}: TaskProps): JSX.Element {
  const [due_date, due_time] = fmtDate(assignment.due_at);
  const gradedSince = fmtDateSince(
    assignment.graded_at ? assignment.graded_at : new Date().toISOString()
  );
  function onClick(e: React.MouseEvent<HTMLInputElement>) {
    e.preventDefault();
    window.location.href = assignment.html_url;
  }
  // if on completed tab, display grade even if it would normally be considered "ungraded" (i.e. 0-point grade)
  const display_grade = complete && assignmentHasGrade(assignment);
  const is_instructor =
    assignment.needs_grading_count && assignment.type !== AssignmentType.NOTE;
  const icon = ASSIGNMENT_ICON[is_instructor ? 'ungraded' : assignment.type];

  const due = 'Due';
  const submittedText =
    !assignment.submitted && complete
      ? 'Unsubmitted'
      : assignment.points_possible
      ? 'Submitted'
      : '';
  const dueText = ` ${due_date} at ${due_time}`;
  const gradedAtText = !display_grade
    ? ''
    : assignment.grade === 'Excused'
    ? ' Excused'
    : ` ${assignment.score}/${assignment.points_possible} points`;
  const pointsPlural = !assignment.points_possible
    ? ''
    : assignment.points_possible > 1
    ? 'points'
    : 'point';
  const pointsText = assignment.points_possible
    ? ` \xa0|\xa0 ${assignment.points_possible} ${pointsPlural}`
    : '';
  const needsGradingText = is_instructor
    ? `${assignment.needs_grading_count} ungraded`
    : '';
  const gradedText =
    assignment.submitted || display_grade
      ? ` ${!display_grade ? ' Waiting for grade' : ' Graded: '}`
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
  const canBeDeleted = [
    AssignmentType.NOTE,
    AssignmentType.GRADESCOPE,
  ].includes(assignment.type);
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
          {!skeleton && !is_instructor ? ( // assignments that need grading should not be marked manually
            <CheckIcon
              checkStyle={complete ? 'Revert' : 'Check'}
              dark={darkMode}
              onClick={markAssignmentAsComplete}
            />
          ) : (
            ''
          )}
          {!skeleton && complete && canBeDeleted ? (
            <CheckIcon
              checkStyle="X"
              dark={darkMode}
              onClick={markAssignmentAsDeleted}
            />
          ) : (
            ''
          )}
        </TaskTop>
        <TaskLink dark={darkMode} href={assignment.html_url}>
          {!skeleton ? assignment.name : <SkeletonTitle dark={darkMode} />}
        </TaskLink>
        <TaskDetailsText>
          {skeleton ? (
            <SkeletonInfo dark={darkMode} />
          ) : !complete || is_instructor ? (
            <>
              <strong>{due}</strong>
              {dueText}
              {is_instructor ? (
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
              {!display_grade && assignment.points_possible ? (
                <>
                  <strong>{submittedText}</strong>
                  {' \xa0|\xa0 '}
                </>
              ) : (
                ''
              )}
              {!display_grade ? <strong>{gradedText}</strong> : gradedText}
              <strong>{gradedAtText}</strong>
              {gradedAtText ? ' | ' + gradedSince : ''}
            </>
          )}
        </TaskDetailsText>
      </TaskInfo>
    </TaskContainer>
  );
}

TaskLink.displayName = 'TaskLink';
