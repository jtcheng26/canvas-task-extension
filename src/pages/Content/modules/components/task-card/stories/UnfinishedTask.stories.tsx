/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/function-component-definition */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import TaskCard from '../TaskCard';
import { AssignmentType } from '../../../types';
import { AssignmentDefaults } from '../../../constants';

export default {
  title: 'Components/Task/Unfinished',
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
  complete: false,
  graded: false,
  graded_at: '',
  color: '#ab3c7d',
  submitted: false,
  skeleton: false,
  needs_grading_count: 0,
};

export const Assignment = Template.bind({});
Assignment.args = {
  ...storyDefaults,
};

export const NeedsGrading = Template.bind({});
NeedsGrading.args = {
  ...storyDefaults,
  needs_grading_count: 4,
};

export const Discussion = Template.bind({});
Discussion.args = {
  ...storyDefaults,
  type: AssignmentType.DISCUSSION,
};

export const Quiz = Template.bind({});
Quiz.args = {
  ...storyDefaults,
  type: AssignmentType.QUIZ,
};

export const Note = Template.bind({});
Note.args = {
  ...storyDefaults,
  type: AssignmentType.NOTE,
};

export const Skeleton = Template.bind({});
Skeleton.args = {
  html_url: '/',
  skeleton: true,
};

export const Default = Template.bind({});
Default.args = {
  ...AssignmentDefaults,
  skeleton: false,
};

// point not points
export const OnePoint = Template.bind({});
OnePoint.args = {
  ...storyDefaults,
  points_possible: 1,
};

export const NoPoints = Template.bind({});
NoPoints.args = {
  ...storyDefaults,
  points_possible: 0,
};
