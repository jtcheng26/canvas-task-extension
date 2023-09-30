/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/function-component-definition */
import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import TaskChart, { TaskChartProps } from '../TaskChart';
import { AssignmentListSample2 } from '../../../tests/data/assignment-list';
import { FinalAssignment } from '../../../types';

export default {
  title: 'Components/TaskChart',
} as ComponentMeta<typeof TaskChart>;

const Template: ComponentStory<typeof TaskChart> = ({
  assignments,
  loading,
  selectedCourseId,
}) => {
  const [selected, setSelected] = useState(selectedCourseId);
  function func(id: string) {
    setSelected(id);
  }
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <TaskChart
        assignments={assignments}
        courses={[]}
        loading={loading}
        selectedCourseId={selected}
        setCourse={func}
      />
    </div>
  );
};

const storyDefaults: Partial<TaskChartProps> = {
  assignments: AssignmentListSample2 as unknown as FinalAssignment[],
  loading: false,
  selectedCourseId: '',
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

export const Loading = Template.bind({});
Loading.args = {
  ...storyDefaults,
  loading: true,
};
