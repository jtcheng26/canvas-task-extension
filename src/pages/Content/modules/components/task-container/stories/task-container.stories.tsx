/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/function-component-definition */
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { OptionsDefaults } from '../../../constants';
import { AssignmentListSample2 } from '../../../tests/data/assignment-list';
import { FinalAssignment } from '../../../types';
import TaskContainer, { TaskContainerProps } from '../TaskContainer';

export default { title: 'Components/TaskContainer' } as ComponentMeta<
  typeof TaskContainer
>;

const storyDefaults: TaskContainerProps = {
  assignments: AssignmentListSample2 as FinalAssignment[],
  loading: false,
  options: OptionsDefaults,
};

const Template: ComponentStory<typeof TaskContainer> = function ({
  assignments,
  loading,
  options,
}: TaskContainerProps) {
  return (
    <div style={{ width: '288px', padding: '24px' }}>
      <TaskContainer
        assignments={assignments}
        loading={loading}
        options={options}
      />
    </div>
  );
};

export const Loading = Template.bind({});
Loading.args = {
  ...storyDefaults,
  loading: true,
};

export const NoAssignments = Template.bind({});
NoAssignments.args = {
  ...storyDefaults,
  assignments: [],
};

export const HasAssignments = Template.bind({});
HasAssignments.args = {
  ...storyDefaults,
  assignments: storyDefaults.assignments?.map((assignment, i) => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + i / 2 - 1);
    assignment.due_at = dueDate.toISOString();
    return assignment;
  }),
};
