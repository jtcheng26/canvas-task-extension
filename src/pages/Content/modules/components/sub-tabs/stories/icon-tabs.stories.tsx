/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/function-component-definition */
import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import SubTabs from '../IconSubTabs1';
import { TaskTypeTab } from '../../task-list/utils/useHeadings';

export default {
  title: 'Components/IconSubTabs1',
  component: SubTabs,
} as ComponentMeta<typeof SubTabs>;

const Template: ComponentStory<typeof SubTabs> = () => {
  const [state, setState] = useState<TaskTypeTab>('Unfinished');
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <SubTabs
        activeColor="var(--ic-brand-font-color-dark)"
        setTaskListState={setState}
        taskListState={state}
      />
    </div>
  );
};

export const Tabs = Template.bind({});
