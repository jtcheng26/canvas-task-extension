/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/function-component-definition */
import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import CourseDropdown, { CourseDropdownProps } from '../CourseDropdown';

export default {
  title: 'Components/CourseDropdown',
  component: CourseDropdown,
} as ComponentMeta<typeof CourseDropdown>;

const Template: ComponentStory<typeof CourseDropdown> = ({
  onCoursePage,
  courses,
  selectedCourseId,
}) => {
  function func() {
    console.log('click');
  }
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <CourseDropdown
        courses={courses}
        onCoursePage={onCoursePage}
        selectedCourseId={selectedCourseId}
        setCourse={func}
      />
    </div>
  );
};

const storyDefaults: Partial<CourseDropdownProps> = {
  onCoursePage: false,
  courses: [
    {
      name: 'Course #1',
      color: 'var(--storybook-theme)',
      id: '1',
      position: 1,
    },
    {
      name: 'Course #2',
      color: '#26f',
      id: '2',
      position: 1,
    },
    {
      name: 'Course #3',
      color: '#2f6',
      id: '3',
      position: 1,
    },
    {
      name: 'Course #4',
      color: '#62f',
      id: '4',
      position: 1,
    },
    {
      name: 'Course #5',
      color: '#f62',
      id: '5',
      position: 1,
    },
  ],
  selectedCourseId: '',
};

export const NoCourses = Template.bind({});
NoCourses.args = {
  ...storyDefaults,
  courses: [],
};

export const OneCourse = Template.bind({});
OneCourse.args = {
  ...storyDefaults,
  courses: storyDefaults.courses?.slice(0, 1),
};

export const SomeCourses = Template.bind({});
SomeCourses.args = {
  ...storyDefaults,
};

// should show `All Courses` as a tab
export const CourseSelected = Template.bind({});
CourseSelected.args = {
  ...storyDefaults,
  selectedCourseId: '4',
};

export const OnCoursePageOneCourse = Template.bind({});
OnCoursePageOneCourse.args = {
  ...storyDefaults,
  courses: storyDefaults.courses?.slice(0, 1),
  onCoursePage: true,
  selectedCourseId: '1',
};

export const OnCoursePage = Template.bind({});
OnCoursePage.args = {
  ...storyDefaults,
  onCoursePage: true,
  selectedCourseId: '4',
};

// error case, shouldn't happen
export const OnCoursePageNoneSelected = Template.bind({});
OnCoursePageNoneSelected.args = {
  ...storyDefaults,
  onCoursePage: true,
};
