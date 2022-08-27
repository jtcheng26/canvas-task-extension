/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/function-component-definition */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import CreateTaskCard from '../CreateTaskCard';

export default {
  title: 'Components/Task/Create',
  component: CreateTaskCard,
} as ComponentMeta<typeof CreateTaskCard>;

const Template: ComponentStory<typeof CreateTaskCard> = (args) => (
  <CreateTaskCard {...args} />
);

const storyDefaults = {
  onSubmit: () => {
    console.log('Submitted create request.');
  },
};

// point not points
export const CreateCard = Template.bind({});
CreateCard.args = storyDefaults;
