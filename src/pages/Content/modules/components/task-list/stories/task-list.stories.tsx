/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/function-component-definition */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import TaskList, { TaskListProps } from '../TaskList';
import { AssignmentDefaults } from '../../../constants';
import { AssignmentListSample } from '../../../tests/data/assignment-list';
import { FinalAssignment } from '../../../types';

export default {
  title: 'Components/TaskList/Unfinished',
  component: TaskList,
} as ComponentMeta<typeof TaskList>;

const Template: ComponentStory<typeof TaskList> = ({
  assignments,
  showDateHeadings,
  skeleton,
  selectedCourseId,
}) => {
  function func() {
    console.log('click');
  }
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <TaskList
        assignments={assignments}
        markAssignment={func}
        selectedCourseId={selectedCourseId}
        showDateHeadings={showDateHeadings}
        skeleton={skeleton}
        weekKey="1"
      />
    </div>
  );
};

const storyDefaults: Partial<TaskListProps> = {
  assignments: AssignmentListSample as FinalAssignment[],
  showDateHeadings: true,
  skeleton: false,
  selectedCourseId: -1,
};

export const Skeleton = Template.bind({});
Skeleton.args = {
  ...storyDefaults,
  skeleton: true,
};

export const NoAssignmentsNoHeadings = Template.bind({});
NoAssignmentsNoHeadings.args = {
  ...storyDefaults,
  assignments: [],
  showDateHeadings: false,
};

export const NoAssignmentsYesHeadings = Template.bind({});
NoAssignmentsYesHeadings.args = {
  ...storyDefaults,
  assignments: [],
  showDateHeadings: true,
};

export const OneAssignmentNoHeadings = Template.bind({});
OneAssignmentNoHeadings.args = {
  ...storyDefaults,
  assignments: [AssignmentDefaults],
  showDateHeadings: false,
};

export const OneAssignmentYesHeadings = Template.bind({});
OneAssignmentYesHeadings.args = {
  ...storyDefaults,
  assignments: [AssignmentDefaults],
  showDateHeadings: true,
};

export const ManyAssignmentsWithHeadings = Template.bind({});
ManyAssignmentsWithHeadings.args = {
  ...storyDefaults,
  assignments: storyDefaults.assignments?.map((assignment, i) => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + i / 2 - 1);
    assignment.due_at = dueDate.toISOString();
    return assignment;
  }),
};
