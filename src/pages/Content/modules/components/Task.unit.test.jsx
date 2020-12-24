import React from 'react';
import { shallow } from 'enzyme';
import Task from './Task';

const color = 'rgb(0, 0, 0)',
  html_url = 'https://this.is.a.test/',
  name = 'Dummy Assignment',
  points_possible = 10;
let due_at = new Date();
due_at.setMonth(1);
due_at.setDate(1);
due_at.setFullYear(1990);
due_at.setHours(10, 10, 10, 10);
due_at = due_at.toISOString();
const mockData = {
  color,
  html_url,
  name,
  points_possible,
  due_at,
};

describe('<Task />', () => {
  it('renders name', () => {
    let wrapper = shallow(<Task assignment={mockData} />);
    expect(wrapper.find('TaskLink').text()).toBe(name);
  });

  it('sets link', () => {
    let wrapper = shallow(<Task assignment={mockData} />);
    expect(wrapper.find('TaskLink').prop('href')).toBe(html_url);
  });
});
