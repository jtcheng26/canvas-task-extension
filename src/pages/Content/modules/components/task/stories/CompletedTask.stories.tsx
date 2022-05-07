/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/function-component-definition */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Task from '../Task';
import { AssignmentType } from '../../../types';

export default {
  title: 'Components/Task/Completed',
  component: Task,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Task>;

// No Canvas fonts/styling, will look a bit different
const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />;

const storyDefaults = {
  name: 'Assignment name',
  type: AssignmentType.ASSIGNMENT,
  html_url: '/',
  due_at: '2022-01-01Z00:00:00',
  course_name: 'Course name',
  points_possible: 10,
  complete: true,
  graded: false,
  score: 0,
  color: '#ab3c7d',
  submitted: true,
  skeleton: false,
};

// point not points
export const OnePoint = Template.bind({});
OnePoint.args = {
  ...storyDefaults,
  points_possible: 1,
};

export const Points = Template.bind({});
Points.args = {
  ...storyDefaults,
  points_possible: 10,
};

export const GradedNoScore = Template.bind({});
GradedNoScore.args = {
  ...storyDefaults,
  points_possible: 10,
  graded: true,
};

export const GradedScore = Template.bind({});
GradedScore.args = {
  ...storyDefaults,
  points_possible: 10,
  score: 10,
  graded: true,
};

export const NoPoints = Template.bind({});
NoPoints.args = {
  ...storyDefaults,
  points_possible: 0,
};

export const Unsubmitted = Template.bind({});
Unsubmitted.args = {
  ...storyDefaults,
  points_possible: 10,
  graded: true,
  submitted: false,
};
