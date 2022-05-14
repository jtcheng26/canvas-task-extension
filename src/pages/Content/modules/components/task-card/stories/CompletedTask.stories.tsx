/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/function-component-definition */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import TaskCard from '../TaskCard';
import { AssignmentType } from '../../../types';

export default {
  title: 'Components/Task/Completed',
  component: TaskCard,
} as ComponentMeta<typeof TaskCard>;

const Template: ComponentStory<typeof TaskCard> = (args) => (
  <TaskCard {...args} />
);

const storyDefaults = {
  name: 'Assignment name',
  type: AssignmentType.ASSIGNMENT,
  html_url: '/',
  due_at: '2022-01-01Z00:00:00',
  course_name: 'Course name',
  points_possible: 10,
  complete: true,
  graded: false,
  graded_at: '',
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
  graded_at: '2022-01-02Z00:00:00',
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
  graded_at: '2022-01-02Z00:00:00',
};
