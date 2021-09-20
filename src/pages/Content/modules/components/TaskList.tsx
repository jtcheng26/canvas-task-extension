import React, { useState } from 'react';
import styled from 'styled-components';
import Task from './Task';
import Subtitle from './Subtitle';
import { Assignment, Options } from '../types';
import getDaysLeft from '../utils/getDaysLeft';
import getDueDateHeadingLabel from '../utils/getDueDateHeadingLabel';
import { TaskListState } from '../types/taskListState';

const ListContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5px;
  padding: 0px;
  padding-bottom: 5px;
`;

const HeadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 5px;
  color: var(--ic-brand-font-color-dark-lightened-30);
  font-size: small;
`;

const ListWrapper = styled.div`
  margin: 10px 0px 25px 0px;
`;

interface ViewMoreProps {
  href: string;
  onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}
const ViewMore = styled.a<ViewMoreProps>`
  font-size: 0.9rem;
`;

interface TaskListProps {
  assignments: Assignment[];
  markAssignmentAsComplete?: (a: Assignment) => void;
  options: Options;
  setTaskListState?: (state: TaskListState) => void;
  skeleton?: boolean;
  taskListState?: TaskListState;
}

/*
  Renders all unfinished assignments
*/
export default function TaskList({
  assignments,
  markAssignmentAsComplete,
  options,
  setTaskListState,
  skeleton,
  taskListState,
}: TaskListProps): JSX.Element {
  const [viewingMore, setViewingMore] = useState(false);
  let viewMoreText = 'View less';
  let renderedAssignments =
    taskListState === 'Unfinished'
      ? assignments
      : assignments.sort(
          (a, b) =>
            (a.submission?.grader_id ? 1 : -1) -
            (b.submission?.grader_id ? 1 : -1)
        );
  if (!viewingMore) {
    renderedAssignments = assignments.slice(0, Math.min(4, assignments.length));
    viewMoreText = `View ${assignments.length - 4} more`;
  }
  const headings: { [key: string]: Assignment[] } = {};
  renderedAssignments.forEach((a) => {
    if (taskListState === 'Unfinished') {
      const daysLeft = getDueDateHeadingLabel(getDaysLeft(a));
      if (!(daysLeft in headings)) headings[daysLeft] = [];
      headings[daysLeft].push(a);
    } else {
      if (a.submission?.grader_id) {
        if (!('Graded' in headings)) headings['Graded'] = [];
        headings['Graded'].push(a);
      } else {
        if (!('Ungraded' in headings)) headings['Ungraded'] = [];
        headings['Ungraded'].push(a);
      }
    }
  });
  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    setViewingMore(!viewingMore);
  }
  const dueText = 'Due';
  const blankAssignment: Assignment = {
    color: '',
    html_url: '/',
    name: '',
    points_possible: 0,
    due_at: '',
    course_id: 0,
    id: 0,
    user_submitted: false,
    is_quiz_assignment: false,
  };
  return (
    <ListWrapper>
      <Subtitle
        setTaskListState={setTaskListState}
        taskListState={taskListState}
        text={taskListState || 'Unfinished'}
      />
      <ListContainer>
        {skeleton ? (
          <>
            <Task assignment={blankAssignment} color="" name="" skeleton />
            <Task assignment={blankAssignment} color="" name="" skeleton />
            <Task assignment={blankAssignment} color="" name="" skeleton />
            <Task assignment={blankAssignment} color="" name="" skeleton />
          </>
        ) : options.due_date_headings || taskListState == 'Completed' ? (
          Object.keys(headings).length > 0 ? (
            Object.keys(headings).map((heading) => (
              <HeadingContainer key={heading}>
                <span>
                  {heading !== 'Overdue' && taskListState == 'Unfinished'
                    ? dueText
                    : ''}{' '}
                  <strong>{heading}</strong>
                </span>
                {headings[heading].map((assignment) => (
                  <Task
                    assignment={assignment}
                    color={assignment.color || '#000000'}
                    key={assignment.id}
                    markComplete={markAssignmentAsComplete}
                    name={assignment.course_name || 'Course'}
                  />
                ))}
              </HeadingContainer>
            ))
          ) : (
            'None'
          )
        ) : (
          renderedAssignments.map((assignment) => (
            <Task
              assignment={assignment}
              color={assignment.color || '#000000'}
              key={assignment.id}
              name={assignment.course_name || 'Course'}
            />
          ))
        )}
      </ListContainer>
      {assignments.length > 4 && (
        <ViewMore href="#" onClick={handleClick}>
          {viewMoreText}
        </ViewMore>
      )}
    </ListWrapper>
  );
}
