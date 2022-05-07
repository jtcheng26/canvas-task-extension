/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/function-component-definition */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Header, { HeaderProps } from '../Header';

export default {
  title: 'Components/Header',
  component: Header,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Header>;

const Template: ComponentStory<typeof Header> = ({
  weekEnd,
  weekStart,
  clickable,
}) => {
  function onPrev() {
    console.log('prev');
  }
  function onNext() {
    console.log('next');
  }
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <Header
        clickable={clickable}
        onNextClick={onNext}
        onPrevClick={onPrev}
        weekEnd={weekEnd}
        weekStart={weekStart}
      />
    </div>
  );
};

const storyDefaults: Partial<HeaderProps> = {
  weekEnd: new Date('2022-01-08'),
  weekStart: new Date('2022-01-01'),
  clickable: true,
};

export const Clickable = Template.bind({});
Clickable.args = {
  ...storyDefaults,
};

export const Unclickable = Template.bind({});
Unclickable.args = {
  ...storyDefaults,
  clickable: false,
};
