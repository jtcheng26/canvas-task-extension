import React, { useState } from 'react';
import styled from 'styled-components';
import Task from './Task';
import Subtitle from './Subtitle';
import { Assignment, Options } from '../types';
import getDaysLeft from '../utils/getDaysLeft';
import getDueDateHeadingLabel from '../utils/getDueDateHeadingLabel';

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
  options: Options;
}

/*
  Renders all unfinished assignments
*/
export default function TaskList({
  assignments,
  options,
}: TaskListProps): JSX.Element {
  const [viewingMore, setViewingMore] = useState(false);
  let viewMoreText = 'View less';
  let renderedAssignments = assignments;
  if (!viewingMore) {
    renderedAssignments = assignments.slice(0, Math.min(4, assignments.length));
    viewMoreText = `View ${assignments.length - 4} more`;
  }
  const headings: { [key: string]: Assignment[] } = {};
  renderedAssignments.forEach((a) => {
    const daysLeft = getDueDateHeadingLabel(getDaysLeft(a));
    if (!(daysLeft in headings)) headings[daysLeft] = [];
    headings[daysLeft].push(a);
  });
  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    setViewingMore(!viewingMore);
  }
  const dueText = 'Due';
  return (
    <ListWrapper>
      <Subtitle text="Unfinished" />
      <ListContainer>
        {options.due_date_headings
          ? Object.keys(headings).length > 0
            ? Object.keys(headings).map((heading) => (
                <HeadingContainer key={heading}>
                  <span>
                    {heading !== 'Overdue' ? dueText : ''}{' '}
                    <strong>{heading}</strong>
                  </span>
                  {headings[heading].map((assignment) => (
                    <Task
                      assignment={assignment}
                      color={assignment.color || '#000000'}
                      key={assignment.id}
                      name={assignment.course_name || 'Course'}
                    />
                  ))}
                </HeadingContainer>
              ))
            : 'None'
          : renderedAssignments.map((assignment) => (
              <Task
                assignment={assignment}
                color={assignment.color || '#000000'}
                key={assignment.id}
                name={assignment.course_name || 'Course'}
              />
            ))}
      </ListContainer>
      {assignments.length > 4 && (
        <ViewMore href="#" onClick={handleClick}>
          {viewMoreText}
        </ViewMore>
      )}
    </ListWrapper>
  );
}
