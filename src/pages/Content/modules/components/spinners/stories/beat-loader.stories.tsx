/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/function-component-definition */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import BeatLoader from '../BeatLoader';

export default {
  title: 'Components/BeatLoader',
  component: BeatLoader,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof BeatLoader>;

const Template: ComponentStory<typeof BeatLoader> = (args) => (
  <BeatLoader {...args} />
);

export const Loader = Template.bind({});
Loader.args = {
  color: 'var(--ic-brand-font-color-dark-lightened-30)',
  loading: true,
  size: 10,
};
