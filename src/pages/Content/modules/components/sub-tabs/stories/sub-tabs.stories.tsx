/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/function-component-definition */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import SubTabs from '../SubTabs';

export default {
  title: 'Components/SubTabs',
  component: SubTabs,
} as ComponentMeta<typeof SubTabs>;

const Template: ComponentStory<typeof SubTabs> = ({ taskListState }) => {
  function func() {
    console.log('click');
  }
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <SubTabs setTaskListState={func} taskListState={taskListState} />
    </div>
  );
};

export const Unfinished = Template.bind({});
Unfinished.args = {
  taskListState: 'Unfinished',
};

export const Completed = Template.bind({});
Completed.args = {
  taskListState: 'Completed',
};
