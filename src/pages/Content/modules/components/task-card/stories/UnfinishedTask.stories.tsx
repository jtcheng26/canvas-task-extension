/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/function-component-definition */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import TaskCard from '../TaskCard';
import { AssignmentType, FinalAssignment } from '../../../types';

export default {
  title: 'Components/Task/Unfinished',
  component: TaskCard,
} as ComponentMeta<typeof TaskCard>;

const Template: ComponentStory<typeof TaskCard> = (args) => (
  <TaskCard
    {...args}
    color="#ab3c7d"
    complete={false}
    course_name="Course name"
  />
);

const storyDefaults: FinalAssignment = {
  name: 'Assignment name',
  type: AssignmentType.ASSIGNMENT,
  html_url: '/',
  due_at: '2022-01-01Z00:00:00',
  points_possible: 10,
  graded: false,
  graded_at: '',
  submitted: false,
  needs_grading_count: 0,
  course_id: '0',
  id: '1',
  plannable_id: '1',
  score: 0,
  marked_complete: false,
};

export const Assignment = Template.bind({});
Assignment.args = {
  assignment: storyDefaults,
};

export const NeedsGrading = Template.bind({});
NeedsGrading.args = {
  assignment: {
    ...storyDefaults,
    needs_grading_count: 4,
  },
};

export const Discussion = Template.bind({});
Discussion.args = {
  assignment: {
    ...storyDefaults,
    type: AssignmentType.DISCUSSION,
  },
};

export const Quiz = Template.bind({});
Quiz.args = {
  assignment: {
    ...storyDefaults,
    type: AssignmentType.QUIZ,
  },
};

export const Note = Template.bind({});
Note.args = {
  assignment: {
    ...storyDefaults,
    type: AssignmentType.NOTE,
  },
};

export const Skeleton = Template.bind({});
Skeleton.args = {
  assignment: {
    ...storyDefaults,
    html_url: '/',
  },
  skeleton: true,
};

export const Default = Template.bind({});
Default.args = {
  assignment: storyDefaults,
  skeleton: false,
};

// point not points
export const OnePoint = Template.bind({});
OnePoint.args = {
  assignment: {
    ...storyDefaults,
    points_possible: 1,
  },
};

export const NoPoints = Template.bind({});
NoPoints.args = {
  assignment: {
    ...storyDefaults,
    points_possible: 0,
  },
};
