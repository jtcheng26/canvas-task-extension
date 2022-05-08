/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/function-component-definition */
import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import TaskChart, { TaskChartProps } from '../TaskChart';
import { AssignmentListSample2 } from '../../../tests/data/assignment-list';
import { FinalAssignment } from '../../../types';

export default {
  title: 'Components/TaskChart/Unfinished',
  component: TaskChart,
} as ComponentMeta<typeof TaskChart>;

const Template: ComponentStory<typeof TaskChart> = ({
  assignments,
  skeleton,
  selectedCourseId,
}) => {
  const [selected, setSelected] = useState(selectedCourseId);
  function func(id: number) {
    setSelected(id);
  }
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <TaskChart
        assignments={assignments}
        selectedCourseId={selected}
        setCourse={func}
        skeleton={skeleton}
      />
    </div>
  );
};

const storyDefaults: Partial<TaskChartProps> = {
  assignments: AssignmentListSample2 as FinalAssignment[],
  skeleton: false,
  selectedCourseId: -1,
};

export const Skeleton = Template.bind({});
Skeleton.args = {
  ...storyDefaults,
  skeleton: true,
};

export const NoAssignments = Template.bind({});
NoAssignments.args = {
  ...storyDefaults,
  assignments: [],
};

export const HasAssignments = Template.bind({});
HasAssignments.args = {
  ...storyDefaults,
};
