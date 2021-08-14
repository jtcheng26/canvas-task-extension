import React, { useState } from 'react';
import styled from 'styled-components';
import Task from './Task';
import Subtitle from './Subtitle';
import { Assignment } from '../types';
import useCourseNames from '../hooks/useCourseNames';
import useCourseColors from '../hooks/useCourseColors';

const ListContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5px;
  padding: 0px 5px;
  padding-bottom: 5px;
`;

interface ListWrapperProps {
  height: number;
}
const ListWrapper = styled.div<ListWrapperProps>`
  height: ${(props) => props.height}px;
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
}

/*
  Renders all unfinished assignments
*/
export default function TaskList({ assignments }: TaskListProps): JSX.Element {
  const [viewingMore, setViewingMore] = useState(false);
  const height = !viewingMore
    ? 25 + Math.min(assignments.length, 4) * 80
    : 25 + assignments.length * 80;
  let viewMoreText = 'View less';
  let renderedAssignments = assignments;
  if (!viewingMore) {
    renderedAssignments = assignments.slice(0, Math.min(4, assignments.length));
    viewMoreText = `View ${assignments.length - 4} more`;
  }
  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    setViewingMore(!viewingMore);
  }
  // const { data: names } = useCourseNames();
  // const { data: colors } = useCourseColors();
  // console.log(names);
  // console.log(colors);
  return (
    <ListWrapper height={height}>
      <Subtitle text="Unfinished" />
      <ListContainer>
        {renderedAssignments.length > 0
          ? renderedAssignments.map((assignment) => {
              return (
                <Task
                  assignment={assignment}
                  color={assignment.color}
                  key={assignment.id}
                  name={assignment.course_name}
                />
              );
            })
          : 'None'}
      </ListContainer>
      {assignments.length > 4 && (
        <ViewMore href="#" onClick={handleClick}>
          {viewMoreText}
        </ViewMore>
      )}
    </ListWrapper>
  );
}
