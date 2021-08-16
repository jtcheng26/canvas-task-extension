import React from 'react';
import { shallow } from 'enzyme';
import Task from './Task';
import { unfinishedAssignment2 } from '../test/assignment';

const mockData = unfinishedAssignment2;

describe('<Task />', () => {
  it('renders name', () => {
    const wrapper = shallow(
      <Task assignment={mockData} color="#000000" name={mockData.course_name} />
    );
    expect(wrapper.find('TaskLink').text()).toBe(mockData.name);
  });

  it('sets link', () => {
    const wrapper = shallow(
      <Task assignment={mockData} color="#000000" name={mockData.course_name} />
    );
    expect(wrapper.find('TaskLink').prop('href')).toBe(mockData.html_url);
  });
});
