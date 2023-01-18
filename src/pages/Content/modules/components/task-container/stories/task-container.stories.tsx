/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/function-component-definition */
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { OptionsDefaults } from '../../../constants';
import { AssignmentListSample2 } from '../../../tests/data/assignment-list';
import { FinalAssignment } from '../../../types';
import Header from '../../header';
import TaskContainer, { TaskContainerProps } from '../TaskContainer';

export default { title: 'Components/TaskContainer' } as ComponentMeta<
  typeof TaskContainer
>;

const storyDefaults: TaskContainerProps = {
  assignments: AssignmentListSample2 as FinalAssignment[],
  loading: false,
  options: OptionsDefaults,
};

const Template: ComponentStory<typeof TaskContainer> = function ({
  assignments,
  courseId = '',
  courseList = [],
  loading,
  options,
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
        onNextClick={func}
        onPrevClick={func}
        weekEnd={tmr}
        weekStart={now}
      />
      <TaskContainer
        assignments={assignments}
        courseId={courseId}
        courseList={courseList}
        loading={loading}
        options={options}
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

export const OnCoursePage = Template.bind({});
OnCoursePage.args = {
  ...storyDefaults,
  courseList: [
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
  courseList: [
    {
      id: '1',
      name: 'The only course',
      color: '#62f',
      position: 0,
    },
  ],
};
