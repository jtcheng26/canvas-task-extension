import React, { useContext } from 'react';
import { AssignmentDefaults, ASSIGNMENT_ICON } from '../../constants';
import { CheckIcon } from '../../icons';
import { fmtDateSince } from './utils/fmtDate';
import { DarkContext } from '../../contexts/contexts';
import {
  TaskDetailsText,
  TaskInfo,
  TaskLeft,
  TaskLink,
  TaskTop,
  TaskProps,
  CourseCodeText,
  SkeletonInfo,
  SkeletonCourseCode,
  SkeletonTitle,
  TaskContainer,
} from './TaskCard';

/*
    Renders an individual task item
*/

export default function AnnouncementCard({
  name = AssignmentDefaults.name,
  type = AssignmentDefaults.type,
  html_url = AssignmentDefaults.html_url,
  due_at = AssignmentDefaults.due_at,
  course_name,
  complete = AssignmentDefaults.marked_complete,
  color,
  markComplete,
  skeleton,
  transitionState,
}: TaskProps): JSX.Element {
  if (complete) color = color + '99';
  const posted_ago = fmtDateSince(due_at);
  function onClick(e: React.MouseEvent<HTMLInputElement>) {
    e.preventDefault();
    window.location.href = html_url;
  }
  const icon = ASSIGNMENT_ICON[type];

  const dueText = `${posted_ago}`;
  function markAssignmentAsComplete() {
    if (markComplete) {
      markComplete();
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
          {!skeleton && !complete ? ( // assignments that need grading should not be marked manually
            <CheckIcon
              checkStyle="Check"
              dark={darkMode}
              onClick={markAssignmentAsComplete}
            />
          ) : (
            ''
          )}
        </TaskTop>
        <TaskLink dark={darkMode} href={html_url} opacity={complete ? 0.5 : 1}>
          {!skeleton ? name : <SkeletonTitle dark={darkMode} />}
        </TaskLink>
        <TaskDetailsText opacity={complete ? 0.5 : 1}>
          {skeleton ? <SkeletonInfo dark={darkMode} /> : dueText}
        </TaskDetailsText>
      </TaskInfo>
    </TaskContainer>
  );
}

TaskLink.displayName = 'TaskLink';
