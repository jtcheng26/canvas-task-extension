import React, { useState } from 'react';
import styled from 'styled-components';
import TaskCard from '../task-card';
import SubTabs from '../sub-tabs/SubTabs';
import { FinalAssignment } from '../../types';
import useHeadings from './utils/useHeadings';
import useSelectedCourse from './utils/useSelectedCourse';
import { filterByTab, sortByTab } from './utils/sortBy';
import cutAssignmentList from './utils/cutList';
import HeadingGroup from './components/HeadingGroup';

const ListContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5px;
  padding: 0px;
  padding-bottom: 5px;
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

export interface TaskListProps {
  assignments: FinalAssignment[];
  markAssignmentAsComplete?: (id: number) => void;
  selectedCourseId: number;
  showDateHeadings: boolean;
  skeleton?: boolean;
}

/*
  Renders all unfinished assignments
*/
export default function TaskList({
  assignments,
  markAssignmentAsComplete,
  selectedCourseId = -1,
  showDateHeadings,
  skeleton,
}: TaskListProps): JSX.Element {
  const [currentTab, setCurrentTab] =
    useState<'Unfinished' | 'Completed'>('Unfinished');
  const [viewingMore, setViewingMore] = useState(false);
  const selectedAssignments = useSelectedCourse(selectedCourseId, assignments);
  const filteredAssignments = filterByTab(currentTab, selectedAssignments);
  const sortedAssignments = sortByTab(currentTab, filteredAssignments);
  const renderedAssignments = cutAssignmentList(
    !viewingMore,
    4,
    sortedAssignments
  );
  const headings = useHeadings(currentTab, renderedAssignments);

  function handleViewMoreClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    setViewingMore(!viewingMore);
  }

  const viewMoreText = !viewingMore
    ? `View ${renderedAssignments.length - 4} more`
    : 'View less';
  const noneText = 'None';

  function markAssignmentFunc(id: number) {
    if (!markAssignmentAsComplete)
      return () => {
        console.log('Failed to mark as complete');
      };
    return () => markAssignmentAsComplete(id);
  }

  const assignmentToTaskCard = (assignment: FinalAssignment) => (
    <TaskCard
      color={assignment.color}
      complete={
        assignment.submitted || assignment.graded || assignment.marked_complete
      }
      course_name={assignment.course_name}
      due_at={assignment.due_at}
      graded={assignment.graded}
      html_url={assignment.html_url}
      key={assignment.id}
      markComplete={markAssignmentFunc(assignment.id)}
      name={assignment.name}
      points_possible={assignment.points_possible}
      score={assignment.score}
      submitted={assignment.submitted}
    />
  );

  if (skeleton)
    return (
      <ListWrapper>
        <SubTabs setTaskListState={setCurrentTab} taskListState={currentTab} />
        <ListContainer>
          <TaskCard skeleton />
          <TaskCard skeleton />
          <TaskCard skeleton />
          <TaskCard skeleton />
        </ListContainer>
      </ListWrapper>
    );
  return (
    <ListWrapper>
      <SubTabs setTaskListState={setCurrentTab} taskListState={currentTab} />
      <ListContainer>
        {showDateHeadings || currentTab == 'Completed'
          ? Object.keys(headings).map(
              (heading) =>
                headings[heading].length > 0 && (
                  <HeadingGroup heading={heading} key={heading}>
                    {headings[heading].map(assignmentToTaskCard)}
                  </HeadingGroup>
                )
            )
          : renderedAssignments.map(assignmentToTaskCard)}
        {renderedAssignments.length == 0 && <span>{noneText}</span>}
      </ListContainer>
      {renderedAssignments.length > 4 && (
        <ViewMore href="#" onClick={handleViewMoreClick}>
          {viewMoreText}
        </ViewMore>
      )}
    </ListWrapper>
  );
}
