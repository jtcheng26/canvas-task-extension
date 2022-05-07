/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/function-component-definition */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import CourseButton, { CourseButtonProps } from '../CourseButton';

export default {
  title: 'Components/CourseButton',
  component: CourseButton,
} as ComponentMeta<typeof CourseButton>;

const Template: ComponentStory<typeof CourseButton> = ({
  name,
  color,
  id,
  last,
  menuVisible,
}) => {
  function func() {
    console.log('click');
  }
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <CourseButton
        color={color}
        id={id}
        last={last}
        menuVisible={menuVisible}
        name={name}
        setCourse={func}
        setMenuVisible={func}
      />
    </div>
  );
};

const storyDefaults: Partial<CourseButtonProps> = {
  name: 'Course Name',
  color: 'var(--storybook-theme)',
  id: 0,
  last: false,
  menuVisible: true,
};

export const NotLast = Template.bind({});
NotLast.args = {
  ...storyDefaults,
};

export const Last = Template.bind({});
Last.args = {
  ...storyDefaults,
  last: true,
};
