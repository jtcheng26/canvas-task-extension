/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/function-component-definition */
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { OptionsDefaults } from '../../../constants';
import { AssignmentListSample2 } from '../../../tests/data/assignment-list';
import { FinalAssignment } from '../../../types';
import Header from '../../header';
import TaskContainer, { TaskContainerProps } from '../TaskContainer';
import { CanvasLMSConfig } from '../../../../entry/runInCanvas';

export default { title: 'Components/TaskContainer' } as ComponentMeta<
  typeof TaskContainer
>;

const storyDefaults: TaskContainerProps = {
  assignments: AssignmentListSample2 as unknown as FinalAssignment[],
  announcements: [],
  courseData: [],
  lms: CanvasLMSConfig,
  loading: false,
  options: OptionsDefaults,
  startDate: new Date(),
  endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
};

const Template: ComponentStory<typeof TaskContainer> = function ({
  announcements,
  assignments,
  courseId = '',
  courseData = [],
  loading,
  options,
  startDate,
  endDate,
}: TaskContainerProps) {
  function func() {
    console.log('click');
  }
  const now = new Date();
  const tmr = new Date();
  tmr.setDate(tmr.getDate() + 1);
  return (
    <div
      style={{
        width: '288px',
        padding: '24px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header
        clickable
        dark={options.dark_mode}
        onNextClick={func}
        onPrevClick={func}
        weekEnd={tmr}
        weekStart={now}
      />
      <TaskContainer
        announcements={announcements}
        assignments={assignments}
        courseData={courseData}
        courseId={courseId}
        endDate={endDate}
        lms={CanvasLMSConfig}
        loading={loading}
        options={options}
        startDate={startDate}
      />
    </div>
  );
};

export const Loading = Template.bind({});
Loading.args = {
  ...storyDefaults,
  loading: true,
};

export const NoAssignments = Template.bind({});
NoAssignments.args = {
  ...storyDefaults,
  assignments: [],
};

export const HasAssignments = Template.bind({});
HasAssignments.args = {
  ...storyDefaults,
  assignments: storyDefaults.assignments?.map((assignment, i) => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + i / 2 - 1);
    assignment.due_at = dueDate.toISOString();
    return assignment;
  }),
};

export const DarkMode = Template.bind({});
DarkMode.args = {
  ...storyDefaults,
  options: { ...OptionsDefaults, dark_mode: true },
  assignments: storyDefaults.assignments?.map((assignment, i) => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + i / 2 - 1);
    assignment.due_at = dueDate.toISOString();
    return assignment;
  }),
};

export const OnCoursePage = Template.bind({});
OnCoursePage.args = {
  ...storyDefaults,
  courseData: [
    {
      id: '1',
      name: 'Unknown Course',
      color: '#26f',
      position: 0,
    },
  ],
  courseId: '1',
};

export const OnCoursePageNoAssignments = Template.bind({});
OnCoursePageNoAssignments.args = {
  ...storyDefaults,
  assignments: [],
  courseId: '1',
  courseData: [
    {
      id: '1',
      name: 'The only course',
      color: '#62f',
      position: 0,
    },
  ],
};
