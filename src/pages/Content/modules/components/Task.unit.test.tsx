import React from 'react';
import { shallow } from 'enzyme';
import Task from './Task';
import { unsubmittedUngraded } from '../tests/data/assignment';

const mockData = unsubmittedUngraded;

describe('<Task />', () => {
  it('renders name', () => {
    const wrapper = shallow(
      <Task assignment={mockData} color="#000000" name="course name" />
    );
    expect(wrapper.find('TaskLink').text()).toBe(mockData.name);
  });

  it('sets link', () => {
    const wrapper = shallow(
      <Task assignment={mockData} color="#000000" name="course name" />
    );
    expect(wrapper.find('TaskLink').prop('href')).toBe(mockData.html_url);
  });
});
