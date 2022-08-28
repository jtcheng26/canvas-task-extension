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
import CreateTaskCard from '../task-card/CreateTaskCard';
import assignmentIsDone from '../../utils/assignmentIsDone';
import Confetti from 'react-dom-confetti';

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

const ConfettiWrapper = styled.div`
  position: absolute;
  top: 350px;
  display: flex;
  justify-content: center;
  width: 100%;
  align-items: center;
  z-index: 10000;
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
  createAssignment?: (assignment: FinalAssignment) => void;
  markAssignment?: (id: number, status: boolean) => void;
  selectedCourseId: number;
  showDateHeadings: boolean;
  skeleton?: boolean;
}

/*
  Renders all unfinished assignments
*/
export default function TaskList({
  assignments,
  createAssignment,
  markAssignment,
  selectedCourseId = -1,
  showDateHeadings,
  skeleton,
}: TaskListProps): JSX.Element {
  const [confetti, setConfetti] = useState(false);
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
    ? `View ${sortedAssignments.length - 4} more`
    : 'View less';

  const noneText = 'None';

  function markAssignmentFunc(id: number) {
    if (!markAssignment)
      return () => {
        console.log('Failed to mark as complete');
      };
    else if (currentTab === 'Completed') {
      return () => markAssignment(id, false);
    }
    return () => {
      setConfetti(true);
      setTimeout(() => {
        stopConfetti();
      }, 100);

      markAssignment(id, true);
    };
  }

  function stopConfetti() {
    setConfetti(false);
  }

  const assignmentToTaskCard = (assignment: FinalAssignment) => (
    <TaskCard
      color={assignment.color}
      complete={assignmentIsDone(assignment)}
      course_name={assignment.course_name}
      due_at={assignment.due_at}
      graded={assignment.graded}
      graded_at={assignment.graded_at}
      html_url={assignment.html_url}
      key={assignment.id}
      markComplete={markAssignmentFunc(assignment.id)}
      name={assignment.name}
      points_possible={assignment.points_possible}
      submitted={assignment.submitted}
      type={assignment.type}
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
      <ConfettiWrapper>
        <Confetti
          active={confetti}
          config={{
            elementCount: 15,
            stagger: 10,
            startVelocity: 20,
          }}
        />
      </ConfettiWrapper>
      <ListContainer>
        {showDateHeadings || currentTab === 'Completed'
          ? Object.keys(headings).map(
              (heading) =>
                headings[heading].length > 0 && (
                  <HeadingGroup heading={heading} key={heading}>
                    {headings[heading].map(assignmentToTaskCard)}
                  </HeadingGroup>
                )
            )
          : renderedAssignments.map(assignmentToTaskCard)}
        {(sortedAssignments.length <= 4 || viewingMore) &&
        currentTab === 'Unfinished' ? (
          <CreateTaskCard
            onSubmit={createAssignment}
            selectedCourse={selectedCourseId}
          />
        ) : (
          ''
        )}

        {renderedAssignments.length == 0 && currentTab === 'Completed' ? (
          <span>{noneText}</span>
        ) : (
          ''
        )}
      </ListContainer>
      {sortedAssignments.length > 4 && (
        <ViewMore href="#" onClick={handleViewMoreClick}>
          {viewMoreText}
        </ViewMore>
      )}
    </ListWrapper>
  );
}
