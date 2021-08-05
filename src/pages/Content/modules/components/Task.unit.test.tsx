import React from 'react';
import { shallow } from 'enzyme';
import Task from './Task';
import { unfinishedAssignment2 } from '../test/assignment';

const mockData = unfinishedAssignment2;

describe('<Task />', () => {
  it('renders name', () => {
    let wrapper = shallow(<Task assignment={mockData} />);
    expect(wrapper.find('TaskLink').text()).toBe(mockData.name);
  });

  it('sets link', () => {
    let wrapper = shallow(<Task assignment={mockData} />);
    expect(wrapper.find('TaskLink').prop('href')).toBe(mockData.html_url);
  });
});
